const Document = require('../models/Document');
const { cloudinary } = require('../config/cloudinary');

// Upload document
exports.uploadDocument = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const { title, category, tags, notes } = req.body;

    const document = new Document({
      userId: req.userId,
      title,
      category,
      fileUrl: req.file.path,
      fileType: req.file.mimetype,
      publicId: req.file.filename,
      thumbnail: req.file.path,
      tags: tags ? tags.split(',') : [],
      notes,
    });

    await document.save();
    res.status(201).json(document);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get all documents
exports.getDocuments = async (req, res) => {
  try {
    const { category } = req.query;
    let query = { userId: req.userId };

    if (category) {
      query.category = category;
    }

    const documents = await Document.find(query).sort({ uploadDate: -1 });
    res.json(documents);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Delete document
exports.deleteDocument = async (req, res) => {
  try {
    const document = await Document.findOne({
      _id: req.params.id,
      userId: req.userId,
    });

    if (!document) {
      return res.status(404).json({ error: 'Document not found' });
    }

    // Delete from Cloudinary
    await cloudinary.uploader.destroy(document.publicId);

    await document.deleteOne();
    res.json({ message: 'Document deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};