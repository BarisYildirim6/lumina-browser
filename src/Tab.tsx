import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import BookmarkAddIcon from '@mui/icons-material/BookmarkAdd';
import BookmarkRemoveIcon from '@mui/icons-material/BookmarkRemove';
import BookmarksIcon from '@mui/icons-material/Bookmarks';
import HistoryIcon from '@mui/icons-material/History';
import ReplayIcon from '@mui/icons-material/Replay';
import {
	Box,
	Divider,
	IconButton,
	MenuItem,
	MenuList,
	Popover,
	TextField,
	Typography,
} from '@mui/material';
import axios from 'axios';
import { useEffect, useRef, useState } from 'react';

export const Tab = () => {
	const myRef = useRef(null);

	const [anchorElB, setAnchorElB] = useState(null);
	const [anchorElH, setAnchorElH] = useState(null);

	const [url, setUrl] = useState('https://www.google.com/');
	const [src, setSrc] = useState('https://www.google.com/');

	const [bookmarks, setBookmarks] = useState([]);
	const [history, setHistory] = useState([]);

	const openB = Boolean(anchorElB);
	const openH = Boolean(anchorElH);

	const idBookmark = openB ? 'simple-popover' : undefined;
	const idHistory = openH ? 'simple-popover' : undefined;

	const handleOpenBookmark = (event) => {
		setAnchorElB(event.currentTarget);
	};

	const handleCloseBookmark = () => {
		setAnchorElB(null);
	};

	const handleOpenHistory = (event) => {
		setAnchorElH(event.currentTarget);
	};

	const handleCloseHistory = () => {
		setAnchorElH(null);
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
			inputUrl = 'http://' + inputUrl;
		}
		setSrc(inputUrl);
	};

	const handleUrlInstant = (url) => {
		let inputUrl = url;

		if (!(inputUrl.startsWith('http://') || inputUrl.startsWith('https://'))) {
			inputUrl = 'http://' + inputUrl;
		}
		setSrc(inputUrl);
	};

	useEffect(() => {
		getBookmarks();
		getHistory();
		if (myRef && myRef.current) {
			myRef.current.addEventListener('did-navigate', (event) => {
				setUrl(event.url);
				addHistory(event.url);
			});
			myRef.current.addEventListener('did-navigate-in-page', (event) => {
				setUrl(event.url);
				addHistory(event.url);
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

	const getBookmarks = async () => {
		await axios
			.get('http://127.0.0.1:7000/getBookmarks')
			.then((res) => {
				if (res && res.data) {
					console.log(res.data);
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

	const getHistory = async () => {
		await axios
			.get('http://127.0.0.1:7000/getHistory')
			.then((res) => {
				if (res && res.data) {
					console.log(res.data);
					const arr = [];
					for (let i = 0; i < res.data.length; i++) {
						arr.push(res.data[i]);
					}
					setHistory(arr);
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

	const addHistory = async (url) => {
		const request = { url: url };
		await axios
			.post('http://127.0.0.1:7000/addHistory', request)
			.then((res) => {
				if (res && res.data) {
					getHistory();
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
			<Box
				sx={{
					display: 'flex',
					flexDirection: 'row',
					justifyContent: 'space-between',
				}}
			>
				<Box>
					<IconButton onClick={handleBack}>
						<ArrowBackIcon />
					</IconButton>
					<IconButton onClick={handleForward}>
						<ArrowForwardIcon />
					</IconButton>
					<IconButton onClick={handleReload}>
						<ReplayIcon />
					</IconButton>
					<IconButton
						aria-describedby={idHistory}
						variant="contained"
						onClick={handleOpenHistory}
					>
						<HistoryIcon />
					</IconButton>
					<Popover
						id={idHistory}
						open={openH}
						anchorEl={anchorElH}
						onClose={handleCloseHistory}
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
							<Typography>History</Typography>
						</Box>
						<Divider sx={{ mt: 1 }} />
						<MenuList>
							{history &&
								history.map((historyTab, index) => (
									<MenuItem
										key={index}
										value={historyTab.url}
										onClick={() => {
											handleUrlInstant(historyTab.url);
											handleCloseHistory();
										}}
									>
										{historyTab.name + ' | ' + historyTab.url}
									</MenuItem>
								))}
						</MenuList>
					</Popover>
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
				<Box>
					<IconButton onClick={addBookmark}>
						<BookmarkAddIcon />
					</IconButton>
					<IconButton onClick={removeBookmark}>
						<BookmarkRemoveIcon />
					</IconButton>
					<IconButton
						aria-describedby={idBookmark}
						variant="contained"
						onClick={handleOpenBookmark}
					>
						<BookmarksIcon />
					</IconButton>
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
										}}
									>
										{bookmark.name + ' | ' + bookmark.url}
									</MenuItem>
								))}
						</MenuList>
					</Popover>
				</Box>
			</Box>
			<Divider sx={{ mt: 3 }} />
			<Box>
				<webview ref={myRef} id="webview" src={src}></webview>
			</Box>
		</>
	);
};
