let serverPort = 4500;

if(process.env.NODE_ENV !== 'development'){
	serverPort = process.env.PORT
}
export default serverPort;