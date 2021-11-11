const reducer = (state = [], action) => {
    switch (action.type) {
        case "FETCH_ALL_INFO":
            return action.payload;
        case "ADD_INFO":
            console.log("add info", action.payload);
            return [...state, action.payload]
        case "DELETE_INFO":
            return state.filter((info) => info._id !== action.id)
        case "UPDATE_INFO":
            return state.map((info) => info._id === action.payload._id ? action.payload : info)
        case "SEARCH_INFO":
            return [...action.payload]
        case "SHOW_INFO":
            return state.map((info) => {
                if(info._id === action.id){
                    info.show = !info.show;
                    return info;
                }
                return info;
            })
        default:
            return state;
    }
}

export default reducer;