class NodeExcessException(Exception):
	def __init__(self, message):
		#call base constructor
		super(NodeExcessException, self).__init__(message)
		self.message = message

class InvalidValue(Exception):
	def __init__(self, message):
		#call base constructor
		super(NodeExcessException, self).__init__(message)
		self.message = message