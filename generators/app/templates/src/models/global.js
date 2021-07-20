const GlobalModel = {
  namespace: 'global',
  state: {
    collapsed: false,
    notices: [],
    scenes: []
  },
  effects: {
  },
  reducers: {
    changeLayoutCollapsed(
      state = {
        notices: [],
        collapsed: true,
      },
      { payload },
    ) {
      return { ...state, collapsed: payload };
    },
    updateState(state, { payload }) {
			return {
				...state,
				...payload,
			};
		},
  },
  subscriptions: {},
};
export default GlobalModel;
