# Container class, it contains a location given by leaflet
class Boundaries:
	def __init__(self, northEast=[0,0], southWest=[0,0], locationName="undefined"):
		self.northEast = northEast
		self.southWest = southWest
		self.locationName = locationName

	def getXAxis(self):
		return [self.northEast[0], self.southWest[0]]

	def getYAxis(self):
		return [self.northEast[1], self.southWest[1]]

class CircleArea:
	def __init__(self, center=[0,0], radius=0, radiusFormat='km'):
		self.center = center
		self.radius = radius
		self.radiusFormat = radiusFormat