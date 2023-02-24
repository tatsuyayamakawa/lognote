import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { FaMoon, FaSun } from 'react-icons/fa'
import { css } from '@emotion/react'

const ToggleDarkMode = () => {
	const [darkMode, setDarkMode] = useState(false);

	useEffect(() => {
		if (
			localStorage.theme === "dark" ||
			(!("theme" in localStorage) && window.matchMedia("(prefers-color-scheme: dark)").matches)
		) {
			setDarkMode(true);
			document.documentElement.setAttribute("data-theme", "dark");
		} else {
			setDarkMode(false);
			document.documentElement.setAttribute("data-theme", "light");
		}
	}, [darkMode]);

	const handleChangeDarkMode = () => {
		if (!darkMode) {
			setDarkMode(true);
			localStorage.theme = "dark";
		} else {
			setDarkMode(false);
			localStorage.theme = "light";
		}
	};

	return (
		<>
			<div css={toggleStyle}>
				<motion.div
					onClick={handleChangeDarkMode}
					key={darkMode ? "dark" : "light"}
					initial={{ rotate: -60, opacity: 0 }}
					animate={{ rotate: 0, opacity: 1 }}
					exit={{ opacity: 0 }}
					transition={{ duration: 1 }}
				>
					{darkMode ? <FaMoon color="#f4d35d" /> : <FaSun color="#ffbf80" />}
				</motion.div>
			</div>
		</>
	);
};

export default ToggleDarkMode

const toggleStyle = css`
	cursor: pointer;
	height: 21px;
	font-size: 21px;
	line-height: 0;
`
