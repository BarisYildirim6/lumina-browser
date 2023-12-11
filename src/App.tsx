import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import BookmarkAddIcon from '@mui/icons-material/BookmarkAdd';
import BookmarkRemoveIcon from '@mui/icons-material/BookmarkRemove';
import BookmarksIcon from '@mui/icons-material/Bookmarks';
import DoneIcon from '@mui/icons-material/Done';
import {
	Box,
	Divider,
	IconButton,
	InputAdornment,
	MenuItem,
	MenuList,
	Popover,
	TextField,
} from '@mui/material';
import { useState } from 'react';
import './App.css';

const PageLayoutRoot = () => ({
	display: 'flex',
	flex: '1 1 auto',
	maxWidth: '100%',
	paddingTop: 10,
});

function App() {
	const [anchorEl, setAnchorEl] = useState(null);

	const [url, setUrl] = useState('https://www.google.com');

	const [bookmarks, setBookmarks] = useState([]);

	const open = Boolean(anchorEl);
	const id = open ? 'simple-popover' : undefined;

	const handleClick = (event) => {
		setAnchorEl(event.currentTarget);
	};

	const handleClose = () => {
		setAnchorEl(null);
	};

	const onChangeUrl = (e) => {
		setUrl(e.target.value);
	};

	return (
		<>
			<Box
				component="main"
				sx={{
					display: 'flex',
					flex: '1 1 auto',
					flexDirection: 'column',
					width: '100vw',
					height: '100vh',
					flexGrow: 1,
				}}
			>
				<Box
					sx={{
						display: 'flex',
						flexDirection: 'row',
						justifyContent: 'space-between',
					}}
				>
					<Box>
						<IconButton>
							<ArrowBackIcon />
						</IconButton>
						<IconButton>
							<ArrowForwardIcon />
						</IconButton>
					</Box>
					<Box>
						<TextField
							onChange={onChangeUrl}
							value={url}
							InputProps={{
								endAdornment: (
									<InputAdornment position="end">
										<IconButton>
											<DoneIcon />
										</IconButton>
									</InputAdornment>
								),
							}}
						>
							{url}
						</TextField>
					</Box>
					<Box>
						<IconButton>
							<BookmarkAddIcon />
						</IconButton>
						<IconButton>
							<BookmarkRemoveIcon />
						</IconButton>
						<IconButton
							aria-describedby={id}
							variant="contained"
							onClick={handleClick}
						>
							<BookmarksIcon />
						</IconButton>
						<Popover
							id={id}
							open={open}
							anchorEl={anchorEl}
							onClose={handleClose}
							anchorOrigin={{
								vertical: 'bottom',
								horizontal: 'left',
							}}
						>
							<MenuList>
								{bookmarks.map((bookmark, index) => (
									<MenuItem key={index} value={bookmark.url}>
										{bookmark.name + ' | ' + bookmark.url}
									</MenuItem>
								))}
							</MenuList>
						</Popover>
					</Box>
				</Box>
				<Divider sx={{ mt: 3 }} />
				<Box>
					<webview id="webview" src={url}></webview>
				</Box>
			</Box>
		</>
	);
}

export default App;
