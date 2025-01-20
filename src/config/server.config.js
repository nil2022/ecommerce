let serverPort = 4500;

if(process.env.NODE_ENV !== 'development'){
	serverPort = process.env.PORT || 3500
}
export default serverPort;