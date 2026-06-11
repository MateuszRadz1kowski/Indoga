"use client";

import { createContext, useContext, useState, useRef, useEffect } from "react";
import { createPortal } from "react-dom";

const TooltipModeContext = createContext(null);

export function useTooltipMode() {
	const context = useContext(TooltipModeContext);
	if (!context)
		throw new Error("useTooltipMode must be used inside TooltipModeProvider");
	return context;
}

export function TooltipModeProvider({ children }) {
	const [tooltipsEnabled, setTooltipsEnabled] = useState(false);
	return (
		<TooltipModeContext.Provider
			value={{ tooltipsEnabled, setTooltipsEnabled }}
		>
			{children}
		</TooltipModeContext.Provider>
	);
}

export function InfoTooltip({ tooltip, position = "top", className = "" }) {
	const { tooltipsEnabled } = useTooltipMode();
	const [visible, setVisible] = useState(false);
	const [coords, setCoords] = useState({
		top: 0,
		left: 0,
		width: 0,
		height: 0,
	});
	const triggerRef = useRef(null);

	const updateCoords = () => {
		if (triggerRef.current) {
			const rect = triggerRef.current.getBoundingClientRect();
			setCoords({
				top: rect.top,
				left: rect.left,
				width: rect.width,
				height: rect.height,
			});
		}
	};

	// Aktualizacja pozycji przy przewijaniu, żeby tooltip trzymał się ikonki
	useEffect(() => {
		if (visible) {
			updateCoords();
			window.addEventListener("scroll", updateCoords, true);
			window.addEventListener("resize", updateCoords);
			return () => {
				window.removeEventListener("scroll", updateCoords, true);
				window.removeEventListener("resize", updateCoords);
			};
		}
	}, [visible]);

	if (!tooltipsEnabled || !tooltip) return null;

	let portalStyle = {};
	let arrowClasses = "absolute w-0 h-0 ";

	if (position == "top") {
		portalStyle = {
			top: coords.top - 8,
			left: coords.left + coords.width / 2,
			transform: "translate(-50%, -100%)",
		};
		arrowClasses +=
			"top-full left-1/2 -translate-x-1/2 border-t-[#1e2d45] border-x-transparent border-b-transparent border-[6px]";
	} else if (position == "bottom") {
		portalStyle = {
			top: coords.top + coords.height + 8,
			left: coords.left + coords.width / 2,
			transform: "translate(-50%, 0)",
		};
		arrowClasses +=
			"bottom-full left-1/2 -translate-x-1/2 border-b-[#1e2d45] border-x-transparent border-t-transparent border-[6px]";
	} else if (position == "left") {
		portalStyle = {
			top: coords.top + coords.height / 2,
			left: coords.left - 8,
			transform: "translate(-100%, -50%)",
		};
		arrowClasses +=
			"left-full top-1/2 -translate-y-1/2 border-l-[#1e2d45] border-y-transparent border-r-transparent border-[6px]";
	} else if (position == "right") {
		portalStyle = {
			top: coords.top + coords.height / 2,
			left: coords.left + coords.width + 8,
			transform: "translate(0, -50%)",
		};
		arrowClasses +=
			"right-full top-1/2 -translate-y-1/2 border-r-[#1e2d45] border-y-transparent border-l-transparent border-[6px]";
	}

	return (
		<>
			<span
				ref={triggerRef}
				className={`relative inline-flex items-center justify-center shrink-0 ${className}`}
				onMouseEnter={() => {
					updateCoords();
					setVisible(true);
				}}
				onMouseLeave={() => setVisible(false)}
				onClick={(e) => {
					e.stopPropagation();
					updateCoords();
					setVisible((v) => !v);
				}}
			>
				<span
					className="inline-flex items-center justify-center w-4 h-4 rounded-full
            bg-violet-500/20 border border-violet-500/40 text-violet-400
            text-[9px] font-black cursor-help select-none
            hover:bg-violet-500/30 hover:border-violet-400/60 hover:text-violet-300
            transition-all duration-200 animate-in fade-in zoom-in"
				>
					?
				</span>
			</span>

			{visible &&
				typeof document !== "undefined" &&
				createPortal(
					<div
						className="fixed z-[99999] w-56 pointer-events-none animate-in fade-in zoom-in-95 duration-150"
						style={portalStyle}
					>
						<div
							className="block rounded-xl border border-violet-500/20
              bg-[#0d1829]/95 backdrop-blur-md shadow-2xl
              shadow-violet-900/30 px-3 py-2.5"
						>
							<span className="block text-[11px] font-bold text-violet-300 mb-1 uppercase tracking-wide">
								{tooltip.title}
							</span>
							<span className="block text-[11px] text-slate-400 leading-relaxed">
								{tooltip.description}
							</span>
						</div>
						<span className={arrowClasses} />
					</div>,
					document.body,
				)}
		</>
	);
}
