const errorHandler = async (err, req, res, next) => {
	if (err.status) {
		res.status(err.status);
	}
	res.send({ success: false, message: err.message });
};

module.exports = errorHandler;
