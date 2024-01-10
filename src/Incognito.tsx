import { 
    Box, 
	Divider,
	IconButton,
	MenuItem,
	MenuList,
	Popover,
	TextField,
	Typography,
	AppBar,
	Table,
	TableBody,
	TableCell,
	TableContainer,
	TableHead,
	TableRow,
	Paper,
	Button,
	Radio,
	RadioGroup,
	FormControl,
	FormLabel,
	FormControlLabel
} from '@mui/material';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { Tabs } from 'antd';
import { useEffect, useRef, useState } from 'react';
import './App.css';
import axios from 'axios';
//import { Tab } from './Tab';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import BookmarkAddIcon from '@mui/icons-material/BookmarkAdd';
import BookmarkRemoveIcon from '@mui/icons-material/BookmarkRemove';
import BookmarksIcon from '@mui/icons-material/Bookmarks';
import HistoryIcon from '@mui/icons-material/History';
import ReplayIcon from '@mui/icons-material/Replay';
import CloseIcon from '@mui/icons-material/Close';
import MoreVertIcon from '@mui/icons-material/MoreVert';

function makeGoogleStatement(url: string){
	if(isValidUrl(url)){
		return url;
	}
	const searchString : string = encodeURIComponent(url)
	
	console.log(searchString)

	return `https://www.google.com/search?q=${searchString}`
}

function getDomainName(url: string){
	const searchString : string = encodeURIComponent(url)
	
	return searchString
}

 function isValidUrl (urlString : string){
	var urlPattern = new RegExp('^(https?:\\/\\/)?'+ // validate protocol
  '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|'+ // validate domain name
  '((\\d{1,3}\\.){3}\\d{1,3}))'+ // validate OR ip (v4) address
  '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*'+ // validate port and path
  '(\\?[;&a-z\\d%_.~+=-]*)?'+ // validate query string
  '(\\#[-a-z\\d_]*)?$','i'); // validate fragment locator
	return !!urlPattern.test(urlString);
}

function openDownload(){

	window.ipcRenderer.send("open-download")

}

function openNewWindow(){

	window.ipcRenderer.send("new-window")

}

function openNewIncognitoWindow(){

	window.ipcRenderer.send("new-incognito-window")

}

function Settings() {
	const browsers = [
		{name:"Google", url:"https://www.google.com/"},
		{name:"Yahoo", url:"https://www.yahoo.com/"},
		{name:"Bing", url:"https://www.bing.com/"},
		{name:"Yandex", url:"https://www.yandex.com/"}
	]

	const [settings, setSettings] = useState({
		"defaultBrowser":{"name":"Google", "url":"https://www.google.com/"}
	});

	const getSettings = async () => {
		await axios
			.get('http://127.0.0.1:7000/getSettings')
			.then((res) => {
				if (res && res.data) {
					console.log(res.data)
					setSettings(res.data);
				}
			})
			.catch((err) => {
				if (err && err.response) {
					console.log('Error:', err.response.data);
				} else {
					console.log('Connection error');
				}
			});
	};

	const handleChange = (event) => {
		const choice = browsers.filter((browser) => browser.name === event.target.value)
		console.log(choice)
		setSettings({
			"defaultBrowser":{"name":choice[0].name, "url":choice[0].url}
		})
	}

	const applySettings = async () => {
		const request = settings;
		await axios
			.post('http://127.0.0.1:7000/applySettings', request)
			.then((res) => {
				if (res) {
					console.log(res)
				}
			})
			.catch((err) => {
				if (err && err.response) {
					console.log('Error:', err.response.data);
				} else {
					console.log('Connection error');
				}
			});
	};

    useEffect(() => {
		getSettings();
    }, []);

	return(
		
		<>
			<Box
				component="main"
				sx={{
					display: 'flex',
					flexDirection: 'column',
					width: "100%",
					height: "100vh"
				}}
			>
				<Box>
					<FormControl>
					<FormLabel id="demo-radio-buttons-group-label">Default Browser</FormLabel>
					<RadioGroup
						aria-labelledby="demo-radio-buttons-group-label"
						defaultValue={settings.defaultBrowser.name}
						name="radio-buttons-group"
						onChange={handleChange}
					>
						{browsers.map((browser, index) => (
							<FormControlLabel key={index} value={browser.name} control={<Radio />} label={browser.name} />
						))}
					</RadioGroup>
					</FormControl>
				</Box>
				<Box>
					<Button onClick={applySettings}>Apply Changes</Button>
				</Box>
			</Box>
		</>
	);
}

function Downloads() {
	const [downloadItems, setDowloadItems] = useState([]);
  
	const getDownloads = async () => {
		await axios
			.get('http://127.0.0.1:7000/getDownloads')
			.then((res) => {
				if (res && res.data) {
					//console.log(res.data);
					const arr = [];
					for (let i = 0; i < res.data.length; i++) {
						arr.push(res.data[i]);
					}
					setDowloadItems(arr);
				}
			})
			.catch((err) => {
				if (err && err.response) {
					console.log('Error:', err.response.data);
				} else {
					console.log('Connection error');
				}
			});
	};

    useEffect(() => {
		getDownloads();
    }, []);


    return (
		<>
			<Box
				sx={{
					width: "100%",
					height: "100vh"
				}}
			>
				<TableContainer component={Paper}>
					<Table sx={{ minWidth: 650 }} aria-label="simple table">
						<TableHead>
						<TableRow>
							<TableCell>ID</TableCell>
							<TableCell align="right">File Name</TableCell>
							<TableCell align="right">URL</TableCell>
							<TableCell align="right">File Location</TableCell>
							<TableCell align="right">Date</TableCell>
						</TableRow>
						</TableHead>
						<TableBody>
							{downloadItems.map((items, index) => (
								<TableRow
								key={index}
								sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
								>
								<TableCell component="th" scope="row">
									{index}
								</TableCell>
								<TableCell align="right">{items.fileName}</TableCell>
								<TableCell align="right">{items.url}</TableCell>
								<TableCell align="right">{items.location}</TableCell>
								<TableCell align="right">{items.date}</TableCell>
								</TableRow>
							))}
						</TableBody>
					</Table>
   	 			</TableContainer>
			</Box>
		</>
    );
}

function Tab(props) {
    const {handleTabName, handleCloseApp, openDownloads, openSettings} = props
    const myRef = useRef(null);

	const [anchorElB, setAnchorElB] = useState(null);
	const [anchorElS, setAnchorElS] = useState(null);

	const [url, setUrl] = useState('https://www.google.com/');
	const [src, setSrc] = useState('https://www.google.com/');

	const [bookmarks, setBookmarks] = useState([]);

	const openB = Boolean(anchorElB);
	const openS = Boolean(anchorElS);

	const idBookmark = openB ? 'simple-popover' : undefined;
	const idSettings = openS ? 'simple-popover' : undefined;

	const handleOpenBookmark = (event) => {
		setAnchorElB(event.currentTarget);
	};

	const handleCloseBookmark = () => {
		setAnchorElB(null);
	};

	const handleOpenSettings = (event) => {
		setAnchorElS(event.currentTarget);
	};

	const handleCloseSettings = () => {
		setAnchorElS(null);
	};

	const onChangeUrl = (event) => {
		setUrl(event.target.value);
	};

	const handleKeyDown = (event) => {
		if (event.key === 'Enter') {
			handleUrl();
		}
	};

	const handleBack = () => {
		myRef.current.goBack();
	};

	const handleForward = () => {
		myRef.current.goForward();
	};

	const handleReload = () => {
		myRef.current.reload();
	};

	const handleUrl = () => {
		let inputUrl = url;

		if (!(inputUrl.startsWith('http://') || inputUrl.startsWith('https://'))) {
			let tempUrl : string = 'http://' + inputUrl;

			if(isValidUrl(tempUrl)){
				inputUrl = tempUrl;
			}

			else {
				inputUrl = makeGoogleStatement(inputUrl)
			}
		}
        console.log(getDomainName(inputUrl));
		setSrc(inputUrl);
	};

	const handleUrlInstant = (url) => {
		let inputUrl = url;

		if (!(inputUrl.startsWith('http://') || inputUrl.startsWith('https://'))) {
			inputUrl = 'http://' + inputUrl;
		}
		setSrc(makeGoogleStatement(inputUrl));
	};

	useEffect(() => {
		getSettings()
		getBookmarks();
		if (myRef && myRef.current) {
			myRef.current.addEventListener('did-navigate', (event) => {
				setUrl(event.url);
			});
			myRef.current.addEventListener('did-navigate-in-page', (event) => {
				setUrl(event.url);
			});
		}

		return () => {
			if (myRef && myRef.current) {
				myRef.current.removeEventListener('did-navigate', (event) => {
					setUrl(event.url);
				});
				myRef.current.removeEventListener('did-navigate-in-page', (event) => {
					setUrl(event.url);
				});
			}
		};
	}, []);

	const getSettings = async () => {
		await axios
			.get('http://127.0.0.1:7000/getSettings')
			.then((res) => {
				if (res && res.data) {
					console.log(res.data.defaultBrowser.url);
					setUrl(res.data.defaultBrowser.url);
					setSrc(res.data.defaultBrowser.url);
				}
			})
			.catch((err) => {
				if (err && err.response) {
					console.log('Error:', err.response.data);
				} else {
					console.log('Connection error');
				}
			});
	};

	const getBookmarks = async () => {
		await axios
			.get('http://127.0.0.1:7000/getBookmarks')
			.then((res) => {
				if (res && res.data) {
					//console.log(res.data);
					const arr = [];
					for (let i = 0; i < res.data.length; i++) {
						arr.push(res.data[i]);
					}
					setBookmarks(arr);
				}
			})
			.catch((err) => {
				if (err && err.response) {
					console.log('Error:', err.response.data);
				} else {
					console.log('Connection error');
				}
			});
	};

	const addBookmark = async () => {
		const request = { url: url };
		await axios
			.post('http://127.0.0.1:7000/addBookmark', request)
			.then((res) => {
				if (res && res.data) {
					getBookmarks();
				}
			})
			.catch((err) => {
				if (err && err.response) {
					console.log('Error: ' + err.response.data.msg);
				} else {
					console.log('Connection error');
				}
			});
	};

	const removeBookmark = async () => {
		const request = { url: url };
		await axios
			.post('http://127.0.0.1:7000/deleteBookmark', request)
			.then((res) => {
				if (res && res.data) {
					console.log(res.data);
					getBookmarks();
				}
			})
			.catch((err) => {
				if (err && err.response) {
					console.log('Error: ' + err.response.data.msg);
				} else {
					console.log('Connection error');
				}
			});
	};

	return (
		<>
			<AppBar position='sticky' sx={{bgcolor: "white"}}>
			<Box
				sx={{
					display: 'flex',
					flexDirection: 'row',
					justifyContent: 'space-between',
					paddingRight: 1
				}}
			>
				<Box sx={{display:"flex", alignItems:"center"}}>
					<IconButton onClick={handleBack}>
						<ArrowBackIcon />
					</IconButton>
					<IconButton onClick={handleForward}>
						<ArrowForwardIcon />
					</IconButton>
					<IconButton onClick={handleReload}>
						<ReplayIcon />
					</IconButton>
				</Box>
				<Box sx={{display:"flex", alignItems:"center"}}>
					<Typography color="black">Incognito</Typography>
				</Box>
				<Box
					sx={{
						display: 'contents',
					}}
				>
					<TextField
						sx={{
							width: '70%',
						}}
						onChange={onChangeUrl}
						value={url}
						onKeyDown={handleKeyDown}
						required
					>
						{url}
					</TextField>
				</Box>
				<Box sx={{display:"flex", alignItems:"center"}}>
					<IconButton onClick={addBookmark}>
						<BookmarkAddIcon />
					</IconButton>
					<IconButton onClick={removeBookmark}>
						<BookmarkRemoveIcon />
					</IconButton>
					<IconButton
						aria-describedby={idSettings}
						variant="contained"
						onClick={handleOpenSettings}
					>
						<MoreVertIcon/>
					</IconButton>
					<Popover
						id={idSettings}
						open={openS}
						anchorEl={anchorElS}
						onClose={handleCloseSettings}
						anchorOrigin={{
							vertical: 'bottom',
							horizontal: 'left',
						}}
					>
						<MenuList>
							<MenuItem onClick={() => {openNewWindow(); handleCloseSettings();}}>New Window</MenuItem>
							<MenuItem onClick={() => {openNewIncognitoWindow(); handleCloseSettings();}}>New Incognito Window</MenuItem>
							<Divider sx={{ mt: 1 }} />
							<MenuItem onClick={() => {openSettings(); handleCloseSettings();}}>Settings</MenuItem>
							<MenuItem onClick={() => {openDownloads(); handleCloseSettings();}}>Downloads</MenuItem>
							<MenuItem
								aria-describedby={idBookmark}
								variant="contained"
								onClick={handleOpenBookmark}
							>
								Bookmarks
							</MenuItem>
						</MenuList>
					</Popover>
					<Popover
						id={idBookmark}
						open={openB}
						anchorEl={anchorElB}
						onClose={handleCloseBookmark}
						anchorOrigin={{
							vertical: 'bottom',
							horizontal: 'left',
						}}
					>
						<Box
							sx={{
								display: 'flex',
								justifyContent: 'center',
								paddingTop: 1,
							}}
						>
							<Typography>Bookmarks</Typography>
						</Box>
						<Divider sx={{ mt: 1 }} />
						<MenuList>
							{bookmarks &&
								bookmarks.map((bookmark, index) => (
									<MenuItem
										key={index}
										value={bookmark.url}
										onClick={() => {
											handleUrlInstant(bookmark.url);
											handleCloseBookmark();
											handleCloseSettings();
										}}
									>
										{bookmark.name + ' | ' + bookmark.url}
									</MenuItem>
								))}
						</MenuList>
					</Popover>
				</Box>
			</Box>
			</AppBar>
			<Box>
				<webview ref={myRef} id="webview" src={src}></webview>
			</Box>
		</>
	);
}

function Incognito() {
	const [tabName, setTabName] = useState("Google");

	const getSettings = async () => {
		await axios
			.get('http://127.0.0.1:7000/getSettings')
			.then((res) => {
				if (res && res.data) {
					const newPanes = [...items];
					newPanes[0].label = res.data.defaultBrowser.name;
					setItems(newPanes)
					setTabName(res.data.defaultBrowser.name)
				}
			})
			.catch((err) => {
				if (err && err.response) {
					console.log('Error:', err.response.data);
				} else {
					console.log('Connection error');
				}
			});
	};

    useEffect(() => {
		getSettings();
    }, []);
	
	const handleCloseApp = () => {
		window.ipcRenderer.send('my-close-app')
	}
	const openSettings = () => {
		const newActiveKey = `newTab${newTabIndex.current++}`;
		const newPanes = [...items];
		newPanes.push({
			label: "Settings",
			children: (
				<>
					<Settings/>
				</>
			),
			key: newActiveKey,
		});
		setItems(newPanes);
		setActiveKey(newActiveKey);
	};
	const openDownloads = () => {
		const newActiveKey = `newTab${newTabIndex.current++}`;
		const newPanes = [...items];
		newPanes.push({
			label: "Downloads",
			children: (
				<>
					<Downloads/>
				</>
			),
			key: newActiveKey,
		});
		setItems(newPanes);
		setActiveKey(newActiveKey);
	};

	const initialItems = [
		{
			label: tabName,
			children: (
				<>
					<Tab handleCloseApp={handleCloseApp} openDownloads={openDownloads} openSettings={openSettings}/>
				</>
			),
			key: '1',
		},
	];

	const [activeKey, setActiveKey] = useState(initialItems[0].key);
	const [items, setItems] = useState(initialItems);
	const newTabIndex = useRef(0);

	if (items.length === 0) {
		window.ipcRenderer.send('my-close-app')
	}

	const onChange = (newActiveKey) => {
		setActiveKey(newActiveKey);
	};

	const add = () => {
		const newActiveKey = `newTab${newTabIndex.current++}`;
		const newPanes = [...items];
		newPanes.push({
			label: tabName,
			children: (
				<>
					<Tab handleCloseApp={handleCloseApp} openDownloads={openDownloads} openSettings={openSettings}/>
				</>
			),
			key: newActiveKey,
		});
		setItems(newPanes);
		setActiveKey(newActiveKey);
	};
	const remove = (targetKey) => {
		let newActiveKey = activeKey;
		let lastIndex = -1;
		items.forEach((item, i) => {
			if (item.key === targetKey) {
				lastIndex = i - 1;
			}
		});
		const newPanes = items.filter((item) => item.key !== targetKey);
		if (newPanes.length && newActiveKey === targetKey) {
			if (lastIndex >= 0) {
				newActiveKey = newPanes[lastIndex].key;
			} else {
				newActiveKey = newPanes[0].key;
			}
		}
		setItems(newPanes);
		setActiveKey(newActiveKey);
	};
	const onEdit = (targetKey, action) => {
		if (action === 'add') {
			add();
		} else {
			remove(targetKey);
		}
	};

	return (
		<>
			<Box
				component="main"
				sx={{
					display: 'flex',
					flex: '1 1 auto',
					flexDirection: 'column',
					width: '98.9vw',
					height: '100vh',
					mt: 0.3
				}}
			>
				<Tabs
					tabPosition={'left'}
					type="editable-card"
					onChange={onChange}
					activeKey={activeKey}
					onEdit={onEdit}
					items={items}
				/>
			</Box>
		</>
	);
}

export default Incognito;