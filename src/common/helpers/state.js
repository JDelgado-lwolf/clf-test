export const setStateData = (statePropName, data, setState) => {
    setState((prevState) => ({
            ...prevState,
            [statePropName]: data
        })
    );
};
