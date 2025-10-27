import { createContext, useContext } from "react";

interface ColorModeContextProps {
	colorMode: "light" | "dark";
	setColorMode: (mode: "light" | "dark") => void;
}

export const ColorModeContext = createContext<
	ColorModeContextProps | undefined
>(undefined);

export const useColorMode = () => {
	const context = useContext(ColorModeContext);
	if (!context) throw new Error("useColorMode must be used within Providers");
	return context;
};
