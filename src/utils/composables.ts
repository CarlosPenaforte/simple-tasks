import {
	ShallowRef, shallowRef,
} from 'vue';

// eslint-disable-next-line no-unused-vars
export function useState<T>(baseState: T): [ShallowRef<T>, (newState: T) => void] {
	const state = shallowRef(baseState);
	const setState = (newState: T) => {
		state.value = newState;
	};

	return [ state, setState ];
}
