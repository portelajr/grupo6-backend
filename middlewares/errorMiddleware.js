const handleError = (err, _req, res, _next) => {
  if (err.code) {
    return res.status(err.code).json({ message: err.message });
  }
    
  if (err.message) {
      return res.status(500).json({ message: err.message });
  }
  console.log(err)
  return res.status(500).json({ message: 'Internal error' });
};
    
module.exports = handleError;
