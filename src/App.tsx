import { Box, IconButton } from '@mui/material';
import { Tabs } from 'antd';
import { useEffect, useRef, useState } from 'react';
import './App.css';
import { Tab } from './Tab';
import CloseIcon from '@mui/icons-material/Close';
import { LeftPanel } from './LeftPanel';

function App() {


	const [tabName, setTabName] = useState("Google");

	const handleTableName = (name) => {
		console.log(name)
		console.log(tabName)
	}

	const initialItems = [
		{
			label: "google",
			children: (
				<div>
					<Tab handleTableName={handleTableName}/>
				</div>
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

	const handleCloseApp = () => {
		window.ipcRenderer.send('my-close-app')
	}

	const onChange = (newActiveKey) => {
		setActiveKey(newActiveKey);
	};

	const add = () => {
		const newActiveKey = `newTab${newTabIndex.current++}`;
		const newPanes = [...items];
		newPanes.push({
			label: "google",
			children: (
				<>
					<Tab handleTableName={handleTableName} />
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
		<div>
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
				<Box sx={{
					display: 'flex',
					justifyContent: 'flex-end',
				}}>
					<IconButton 
						sx={{
							backgroundColor: "red"
						}}
						onClick={handleCloseApp}
					>
						<CloseIcon/>
					</IconButton>
				</Box>

				{
				<Tabs
					tabPosition={'left'}
					type="editable-card"
					onChange={onChange}
					activeKey={activeKey}
					onEdit={onEdit}
					items={items}
				/>
				}
				
			</Box>
		</div>
	);
}

export default App;
