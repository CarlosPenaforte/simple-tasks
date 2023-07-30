import {
	ShallowRef, UnwrapNestedRefs, reactive, shallowRef,
} from 'vue';

// eslint-disable-next-line no-unused-vars
export function useState<T>(baseState: T): [ShallowRef<T>, (newState: T) => void] {
	let state = shallowRef(baseState);
	const setState = (newState: T) => {
		state = shallowRef(newState);
	};

	return [ state, setState ];
}

// eslint-disable-next-line no-unused-vars
export function useReactiveState<T extends object>(baseState: T): [UnwrapNestedRefs<T>, (newState: T) => void] {
	let state = reactive(baseState);
	const setState = (newState: T) => {
		state = reactive(newState);
	};

	return [ state, setState ];
}
