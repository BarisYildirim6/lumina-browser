const express = require('express');
const app = express();
const port = 7000;
const fs = require('fs');
const path = require('path')

var cors = require('cors');
app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
	res.send('Hello from your simple Express server!');
});

app.get('/getBookmarks', (req, res) => {
	const data = JSON.parse(fs.readFileSync(path.join(__dirname, 'bookmarks.json'), 'utf8'));
	let bookmarks = data;
	//console.log(bookmarks);
	res.send(bookmarks);
});

app.post('/addBookmark', (req, res) => {
	let url = req.body.url;
	let name = getDomainName(url);
	const data = JSON.parse(fs.readFileSync(path.join(__dirname, 'bookmarks.json'), 'utf8'));
	if (!url) {
		res.status(400).send({ msg: 'Missing URL!' });
	} else if (data.filter((bookmark) => bookmark.url === url).length > 0) {
		res.status(400).send({ msg: 'Bookmark already exists!' });
	} else {
		//console.log(data);
		data.push({ name: name, url: url });
		fs.writeFileSync(path.join(__dirname, 'bookmarks.json'), JSON.stringify(data), 'utf8');
		res.sendStatus(200);
	}
});

app.post('/deleteBookmark', (req, res) => {
	let url = req.body.url;
	let data = JSON.parse(fs.readFileSync(path.join(__dirname, 'bookmarks.json'), 'utf8'));
	if (!url) {
		res.status(400).send({ msg: 'Missing URL!' });
	} else if (data.filter((bookmark) => bookmark.url === url).length === 0) {
		res.status(400).send({ msg: 'Bookmark does not exist!' });
	} else {
		data = data.filter((bookmark) => bookmark.url !== url);
		fs.writeFileSync(path.join(__dirname, 'bookmarks.json'), JSON.stringify(data), 'utf8');
		res.sendStatus(200);
	}
});

app.get('/getHistory', (req, res) => {
	const data = JSON.parse(fs.readFileSync(path.join(__dirname, 'history.json'), 'utf8'));
	let history = data;
	console.log(history);
	res.send(history);
});

app.post('/addHistory', (req, res) => {
	let url = req.body.url;
	let name = getDomainName(url);
	const data = JSON.parse(fs.readFileSync(path.join(__dirname, 'history.json'), 'utf8'));
	//console.log(data);
	data.push({ name: name, url: url });
	fs.writeFileSync(path.join(__dirname, 'history.json'), JSON.stringify(data), 'utf8');
	res.sendStatus(200);
});

app.post('/deleteHistory', (req, res) => {
	let url = req.body.url;
	let data = JSON.parse(fs.readFileSync(path.join(__dirname, 'history.json'), 'utf8'));
	data = data.filter((bookmark) => bookmark.url !== url);
	fs.writeFileSync(path.join(__dirname, 'history.json'), JSON.stringify(data), 'utf8');
	res.sendStatus(200);
});

app.post('/download', (req, res) => {

	let fileName = req.body.fileName
	let url = req.body.url
	let location = req.body.location
	let date = req.body.date

	const filePath = path.join(__dirname, 'download.json')

	let str = fs.readFileSync(filePath, 'utf8')
	const downloads = JSON.parse(str)
	downloads.push({
		'fileName' : fileName,
		'url' : url,
		'location' : location,
		'date' : date
	})

	
	fs.writeFileSync(filePath, JSON.stringify(downloads), 'utf-8')

	res.send(200)
})

app.get('/getDownloads', (req, res) => {
	const filePath = path.join(__dirname, 'download.json')
	let str = fs.readFileSync(filePath, 'utf8')
	const downloads = JSON.parse(str)

	console.log(downloads)

	res.send(str, 200)
})

app.post('/deleteDownload', (req, res) => {

	let fileName = req.body.fileName
	let url = req.body.url
	let location = req.body.location
	let date = req.body.date

	

	const filePath = path.join(__dirname, 'download.json')
	let str = fs.readFileSync(filePath, 'utf8')
	let downloads = JSON.parse(str)

	downloads = downloads.filter((download) => 

		download.fileName !== fileName ||
		download.url !== url ||
		download.location !== location ||
		download.date !== date

	)

	fs.writeFileSync(filePath, JSON.stringify(downloads), 'utf-8')

	res.send(200)


})

app.post('/showInFolder', (req, res) => {

	let path = req.body.location

	openExplorer(path, err =>{

		if(err){
			console.log(err)
		}

		else{

			console.log("File Explorer Opened")

		}

	})


})

app.listen(port, () => {
	console.log(`Server is listening on port ${port}`);
});

function getDomainName(url) {
	var domain = '';
	if (url.substring(0, 5) === 'https') {
		domain = url.substring(8);
	} else if (url.substring(0, 4) === 'http') {
		domain = url.substring(7);
	} else if (url.substring(0, 3) === 'www') {
		domain = url.substring(4);
	} else {
		domain = url;
	}
	//console.log(domain.split('.'));
	return domain.split('.')[1];
}
