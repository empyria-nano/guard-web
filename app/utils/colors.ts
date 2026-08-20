// "error" | "primary" | "secondary" | "success" | "info" | "warning" | "neutral"
// status — possible values: pending, scheduled, ready, running, paused, backing-off, suspended, completed
// completion_result — only set when status = 'completed': success or failure

export const colors = {
	status: {
		completed: 'success',
		pending: 'info',
		scheduled: 'info',
		ready: 'info',
		running: 'warning',
		'backing-off': 'warning',
		suspended: 'warning',
		default: 'neutral',
	},
	completion: {
		success: 'success',
		failure: 'error',
	},
}

export function componentColor(status: string, completion: string): string {
	return colors.completion[completion] ?? colors.status[status] ?? colors.status.default
}

export function dotColor(status, completion_result): string {
	return status !== 'completed'
		? 'yellow'
		: !completion_result
			? 'ghost'
			: completion_result === 'failure'
				? 'red'
				: 'green'
}

export function textColor(status, completion_result): string {
	return status !== 'completed'
		? 'text-warning'
		: !completion_result
			? 'text-info'
			: completion_result === 'failure'
				? 'text-error'
				: 'text-success'
}
