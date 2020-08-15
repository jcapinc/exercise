import fs from 'fs';
import path from 'path';

const filename = path.resolve('help.txt');
console.log({filename});
fs.open(filename, 'r', async (err, fd) => {
	console.log("Opened: %d", fd);
	if (err) throw err;
	const buffer = Buffer.alloc(1024 * 1024);
	fs.read(fd, buffer, 0, buffer.length, 0, (err, bytes) => console.log(
		"Bytes: %d\nErr: \x1b[41m%s\x1b[0m\nBody: \x1b[40m%s\x1b[0m", 
		bytes, 
		(err || "").toString(), 
		buffer.toString('utf8')));
});