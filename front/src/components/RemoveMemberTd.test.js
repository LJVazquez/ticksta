import '@testing-library/jest-dom';
import { screen, render } from '@testing-library/react';
import user from '@testing-library/user-event';

import AuthProviderMock from '../utils/AuthProviderMock';
import RemoveMemberTd from './RemoveMemberTd';

const removeMember = jest.fn();

const renderComponent = () => {
	render(
		<AuthProviderMock>
			<RemoveMemberTd removeMember={removeMember} />
		</AuthProviderMock>
	);
};

it('should display the remove member button', async () => {
	renderComponent();

	const removeMemberButton = screen.getByRole('button', {
		name: /remove member button/i,
	});

	expect(removeMemberButton).toBeInTheDocument();
});

it('should display the confirm button after clicking the remove member button', async () => {
	renderComponent();

	const removeMemberButton = await screen.getByRole('button', {
		name: /remove member button/i,
	});

	await user.click(removeMemberButton);

	const confirmRemoveButton = await screen.findByRole('button', {
		name: /confirm remove member button/i,
	});

	expect(confirmRemoveButton).toBeInTheDocument();
});

it('should call removeMember when the confirm button is clicked', async () => {
	renderComponent();

	const removeMemberButton = await screen.getByRole('button', {
		name: /remove member button/i,
	});

	await user.click(removeMemberButton);

	const confirmRemoveButton = await screen.findByRole('button', {
		name: /confirm remove member button/i,
	});

	await user.click(confirmRemoveButton);

	expect(removeMember).toHaveBeenCalled();
});
