import React, { createContext, useState, useContext } from "react";

export const NavigateBackContext = createContext();

export const NavigateBackProvider = ({ children }) => {
    const [isReturnButtonVisible, setIsReturnButtonVisible] = useState(false);
    const [onReturnCallback, setOnReturnCallback] = useState(null);

    const showReturnButton = () => {
        setIsReturnButtonVisible(true);
    }

    const hideReturnButton = () => {
        setIsReturnButtonVisible(false);
    }

    const setReturnCallback = (callback) => {
        setOnReturnCallback(() => callback);
    }

    const handleReturn = () => {
        if (onReturnCallback) {
            onReturnCallback();
        }
        hideReturnButton();
    }

    return (
        <NavigateBackContext.Provider value={{
            isReturnButtonVisible,
            setIsReturnButtonVisible,
            showReturnButton,
            setReturnCallback,
            hideReturnButton,
            handleReturn
        }}>
            {children}
        </NavigateBackContext.Provider>
    );
}

export const useNavigateBack = () => useContext(NavigateBackContext);