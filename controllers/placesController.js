const placesService = require("../services/placesService");

exports.searchPlaces = async (req, res) => {
  try {
    const city = req.query.city;

    if (!city) {
      return res.render("places/search", {
        result: null,
        error: null
      });
    }

    const result = await placesService.searchPlaces(city);

    res.render("places/search", {
      result,
      error: null
    });

  } catch (error) {
    console.error("Places error:", error.message);

    res.render("places/search", {
      result: null,
      error: "Could not find places for this destination."
    });
  }
};
exports.showPlace = async (req, res) => {
  try {
    const { xid } = req.params;
    const city = req.query.city || "";

    const place = await placesService.getPlaceDetails(xid);

    res.render("places/show", {
      place,
      city,
      error: null
    });
  } catch (error) {
    console.error("Place details error:", error.message);

    res.render("places/show", {
      place: null,
      city: req.query.city || "",
      error: "Could not load place details."
    });
  }
};