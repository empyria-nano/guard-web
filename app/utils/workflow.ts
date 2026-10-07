export const isFinished = (callChain) => {
	return callChain?.status === 'completed'
}

export const wfOutput = (callChain) => {
	return callChain?.journal?.result ?? callChain?.completion_failure
}
