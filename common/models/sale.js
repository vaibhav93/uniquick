module.exports = function(Sale) {
	 Sale.validatesUniquenessOf('transactionid', {message: 'Transaction ID is not unique'});
};
