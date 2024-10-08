const imageAnalysisModel = require('../models/imageAnalysisModel');

// Controller to analyze an image and verify if it's a food item
async function analyzeImage(req, res) {
  try {
    const { imageUrl } = req.body; // Incoming image URL for analysis
    const result = await imageAnalysisModel.analyzeImage(imageUrl);
    if (result.isFood) {
      res.json({ message: 'Image verified as a food item', result });
    } else {
      res.status(400).json({ message: 'The image is not recognized as a food item' });
    }
  } catch (err) {
    console.error('Error analyzing image:', err);
    res.status(500).send('Server Error');
  }
}

module.exports = {
  analyzeImage,
};
