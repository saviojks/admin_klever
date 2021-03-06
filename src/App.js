import React, { useEffect, useState } from 'react';
import {
	Box,
	FormField,
	Grid,
	Grommet,
	Heading,
	Button,
	TextInput,
	CheckBox
} from 'grommet';
import { grommet } from 'grommet/themes';
import { toast, ToastContainer } from 'react-toastify';
import CountUp from 'react-countup';
import Balance from './controllers/Balance';
import WalletValidator from 'wallet-address-validator';
// import socket from './services/io';
import 'react-toastify/dist/ReactToastify.css';
function App() {

	const [value, setValue] = useState('')
	const [confirmed, setConfirmed] = useState(0)
	const [unconfirmed, setUnconfirmed] = useState(0)
	const [error, setError] = useState('')
	const [checked, setChecked] = useState(null);
	const [loading, setLoading] = useState(false)
	const [intervalEnabled, setIntervalEnabled] = useState(false)

	useEffect(() => {
		if (checked) {
			setIntervalEnabled(setInterval(handleSubmit, 12000))
			// socket.on('new_confirmed', data => {
			// 	setConfirmed(data)
			// })
			// socket.on('new_unconfirmed', data => {
			// 	setUnconfirmed(data)
			// })
		} else {
			setIntervalEnabled(null)
			clearInterval(intervalEnabled)
		}

	}, [checked])

	async function handleSubmit(e) {
		if (e) {
			e.preventDefault()
		}
		setLoading(true)
		const valid = WalletValidator.validate(value)
		if (!valid) {
			setLoading(false)
			if (!checked) {
				return toast.warn('Your address is not valid!')
			}
			return
		}
		const response = await Balance.view(value)
		if (response?.status === 200) {
			setConfirmed(response?.data?.confirmed)
			setUnconfirmed(response?.data?.unconfirmed)
			setLoading(false)
			if (!checked) {
				toast.success(`Success`);
			}
		}
		if (response?.status !== 200) {
			setError(response?.error.response?.data?.message)
			toast.error(response?.error.response?.data?.message);
		}
		setLoading(false)
	};

	return (
		<Grommet theme={grommet} background="#0b0b1e">
			<ToastContainer />
			<Grid pad={{ bottom: 'xlarge' }} background="#0b0b1e" align='center' columns={{ count: 'fit', size: 'medium' }} gap="medium">
				<Box align='stretch'  >
					<Box gridArea="header" background="brand" background="linear-gradient(80deg,#DC3F89 0%,#903EDD 100%)" >
						<Heading margin={{ left: 'xlarge' }} level={1} size="xsmall"> Bitcoin address </Heading>
					</Box>
					<Box margin='medium' align='stretch' >
						<Box align='stretch' background="linear-gradient(80deg,#DC3F89 0%,#903EDD 100%)" margin='large' round='medium' direction='column' >

							<FormField htmlFor="text-input-id" name="example1" label="Your Address" error={error} >
								<TextInput id="example1-id" name="example1" value={value} onChange={({ target }) => setValue(target.value)} />
							</FormField>
							<Box align='center' direction='row-responsive' >
								<Button size='medium' disabled={loading || value?.length < 1} margin='medium' type="submit" label="Submit" onClick={() => handleSubmit()} />
								<Button size='medium' disabled={loading} margin='medium' type="submit" label="Clean" onClick={() => { setError(''); setValue('') }} />
							</Box>
						</Box>
						<Box align='stretch' margin='large' round='medium' direction='row'  >
							<Box align='center' background="linear-gradient(80deg,#DC3F89 0%,#903EDD 100%)" margin='medium' round='medium' pad={{ horizontal: 'medium' }} >
								<Heading level={1} size="xsmall">Confirmed Balance</Heading>
								<Heading level={1} size="xsmall">
									<CountUp start={0} end={confirmed} duration={5} />
								</Heading>
							</Box>
							<Box align='center' background="linear-gradient(80deg,#DC3F89 0%,#903EDD 100%)" margin='medium' round='medium' pad={{ horizontal: 'medium' }} >
								<Heading level={1} size="xsmall">Unconfirmed Balance</Heading>
								<Heading level={1} size="xsmall">
									<CountUp start={0} end={unconfirmed} duration={5} />
								</Heading>
							</Box>
							<Box align='center' background="linear-gradient(80deg,#DC3F89 0%,#903EDD 100%)" margin='medium' round='medium' pad={{ horizontal: 'medium' }} >
								<Heading level={1} size="xsmall">Auto Update?</Heading>
								<CheckBox
									disabled={!WalletValidator.validate(value)}
									checked={checked}
									label={checked ? 'Enabled' : 'Desabled'}
									onChange={({ target }) => setChecked(target.checked)}
								/>
							</Box>
						</Box>
					</Box>
				</Box>
			</Grid>
		</Grommet>
	);
}

export default App;
