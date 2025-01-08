const Card = require("../models/Appointment");

//@desc     Get single card
//@route    GET /api/v1/appointments/:id
//@access   Public
exports.getCard = async (req, res, next) => {
  try {
    const { id, name, description } = req.query;

    // Build the query object based on the provided parameters
    const query = {};
    if (id) {
      query._id = id; // Assuming id is the MongoDB object ID
    }
    if (name) {
      query.name = { $regex: name, $options: "i" }; // Case-insensitive search
    }
    if (description) {
      query.description = { $regex: description, $options: "i" }; // Case-insensitive search
    }

    // Fetch the card(s) from the database
    const cards = await Card.find(query);

    // Check if any cards were found
    if (!cards.length) {
      return res.status(404).json({ message: "No cards found" });
    }

    // Respond with the found cards
    return res.status(200).json(cards);
  } catch (error) {
    // Handle any errors that occurred during the request
    return next(error); // Pass the error to the error-handling middleware
  }
};

//@desc     Add card
//@route    POST /api/v1/cards/:cardId
//@access   Private
exports.addCard = async (req, res, next) => {
  try {
    // Assuming the JSON data is sent in the request body
    const { id, name, status, description } = req.body;

    // Create a new card object
    const newCard = new Card({
      id, // Assuming id is also stored as a property, though typically it's handled by the database
      name,
      status,
      description,
    });

    // Save the new card to the database
    await newCard.save();

    // Respond with the created card and a 201 status
    return res.status(201).json({
      message: "Card added successfully",
      card: newCard,
    });
  } catch (error) {
    // Handle any errors that occurred during the request
    return next(error); // Pass the error to the error-handling middleware
  }
};

//@desc     Update card
//@route    PUT /api/v1/appointments/:id
//@access   Private
exports.updateCard = async (req, res, next) => {
  try {
    // Assuming the card ID is passed as a URL parameter and the new data in the request body
    const { id } = req.params;
    const { name, status, description } = req.body;

    // Find the card by its ID and update it with the new values
    const updatedCard = await Card.findByIdAndUpdate(
      id,
      { name, status, description },
      { new: true, runValidators: true } // Return the updated document and validate
    );

    // Check if the card was found and updated
    if (!updatedCard) {
      return res.status(404).json({ message: "Card not found" });
    }

    // Respond with the updated card
    return res.status(200).json({
      message: "Card updated successfully",
      card: updatedCard,
    });
  } catch (error) {
    // Handle any errors that occurred during the request
    return next(error); // Pass the error to the error-handling middleware
  }
};

//@desc     Delete appointment
//@roue     DELETE /api/v1/appointments/:id
//@access   Private
exports.deleteAppointment = async (req, res, next) => {
  try {
    const card = await Card.findById(req.params.id);

    if (!card) {
      return res.status(404).json({
        success: false,
        message: `No appointment with the id of ${req.params.id}`,
      });
    }

    await card.deleteOne();
    res.status(200).json({
      success: true,
      data: {},
    });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ success: false, message: "Cannot delete Appointment" });
  }
};
