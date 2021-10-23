const Tour = require('../models/tourModel');

exports.getAllTours = async (req, res) => {
  try {
    //! Build a query
    console.log(req.query);

    // 1a) Filtering ['page', 'sort', 'limit', 'fields'];
    const queryObj = { ...req.query };
    const excludedFields = ['page', 'sort', 'limit', 'fields'];
    excludedFields.forEach(field => delete queryObj[field]);

    // 1b) Advanced filtering stringify and parse
    let queryStr = JSON.stringify(queryObj);
    queryStr = queryStr.replace(/\b(lte|lt|gte|gt)\b/g, match => `$${match}`);
    let query = Tour.find(JSON.parse(queryStr));

    // 2) Sorting
    if (req.query.sort) {
      const querySorted = req.query.sort.replace(/,/g, ' ');
      query = query.sort(querySorted);
    } else {
      query.sort('-createdAt');
    }

    // 3) Field limiting
    if (req.query.fields) {
      const queryFields = req.query.fields.replace(/,/g, ' ');
      query = query.select(queryFields);
    } else {
      query.select('-__v');
    }

    // 4) Pagination
    const queryPage = +req.query.page || 1;
    const queryLimit = +req.query.limit || 100;
    const skip = (queryPage - 1) * queryLimit;
    query = query.skip(skip).limit(queryLimit);

    if (req.query.page) {
      const numTours = await Tour.countDocuments();
      if (skip >= numTours) {
        throw new Error('This page does not exist');
      }
    }

    //! Execute a query
    const allTours = await query;

    //! Send response
    res.status(200).json({
      status: 'success',
      count: allTours.length,
      data: {
        tours: allTours,
      },
    });
  } catch (err) {
    res.status(404).json({
      status: 'fail',
      message: err,
    });
  }
};

exports.getTour = async (req, res) => {
  try {
    const tour = await Tour.findById(req.params.id);
    res.status(200).json({
      status: 'success',
      data: {
        tour,
      },
    });
  } catch (err) {
    res.status(404).json({
      status: 'fail',
      message: 'Something went wrong',
    });
  }
};

exports.createTour = async (req, res) => {
  try {
    const tour = await Tour.create(req.body);
    res.status(201).json({
      status: 'success',
      data: {
        tour,
      },
    });
  } catch (err) {
    res.status(400).json({
      status: 'fail',
      message: 'Invalid data sent',
    });
  }
};

exports.changeTour = async (req, res) => {
  try {
    const tour = await Tour.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    res.status(200).json({
      status: 'success',
      data: {
        tour,
      },
    });
  } catch (err) {
    res.status(404).json({
      status: 'fail',
      message: 'Something went wrong',
    });
  }
};

exports.deleteTour = async (req, res) => {
  try {
    await Tour.findByIdAndDelete(req.params.id);
    res.status(204).json({
      status: 'success',
      data: null,
    });
  } catch (err) {
    res.status(404).json({
      status: 'fail',
      message: 'Something went wrong',
    });
  }
};
