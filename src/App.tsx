import { Box } from '@mui/material';
import { Tabs } from 'antd';
import { useRef, useState } from 'react';
import './App.css';
import { Tab } from './Tab';

function App() {
	const initialItems = [
		{
			label: 'Tab 1',
			children: (
				<>
					<Tab />
				</>
			),
			key: '1',
		},
	];

	const [activeKey, setActiveKey] = useState(initialItems[0].key);
	const [items, setItems] = useState(initialItems);
	const newTabIndex = useRef(0);

	const onChange = (newActiveKey) => {
		setActiveKey(newActiveKey);
	};

	const add = () => {
		const newActiveKey = `newTab${newTabIndex.current++}`;
		const newPanes = [...items];
		newPanes.push({
			label: 'New Tab',
			children: (
				<>
					<Tab />
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
					width: '100vw',
					height: '100vh',
					flexGrow: 1,
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

export default App;
