import { useDataProvider } from "ra-core";
import { useAppContext } from "../App";
import { useEffect, useState } from "react";
import { ServerStatusComponent } from "../synapse/dataProvider";
import { Box, Stack } from "@mui/material";
import CheckBoxIcon from '@mui/icons-material/CheckBox';
import CloseIcon from '@mui/icons-material/Close';

const ServerStatusPage = () => {
	const [isOkay, setIsOkay] = useState(false);
	const [isActionable, setIsActionable] = useState(false);
	const [successCheck, setSuccessCheck] = useState(false);
	const [results, setResults] = useState<ServerStatusComponent[]>([]);

	const { etkeccAdmin } = useAppContext();
	const dataProvider = useDataProvider();

	const fetchServerStatus = async () => {
		if (!etkeccAdmin) {
			return null;
		}
		const serverStatus = await dataProvider.getServerStatus(etkeccAdmin);
		setIsOkay(serverStatus.ok);
		setIsActionable(serverStatus.actionable);
		setSuccessCheck(serverStatus.success);
		setResults(serverStatus.results);
	};

	useEffect(() => {
		fetchServerStatus();
	}, [etkeccAdmin]);

	if (!successCheck) {
		return null;
	}

	return <Stack gap="5" direction="column">
		<Box sx={{ display: "flex", direction: "row", alignItems: "center", gap: 2}}>OK: {isOkay ? <CheckBoxIcon /> : <CloseIcon />}</Box>
		<Box sx={{ display: "flex", direction: "row", alignItems: "center", gap: 2}}>Actionable: {isActionable ? <CheckBoxIcon /> : <CloseIcon />}</Box>
		<Box>Results: <Box sx={{marginLeft: 3}}>{results.map((result, idx) => {
			return (<Box sx={{ marginBottom: 2 }} key={idx+1}>
					Actionable {result.actionable} <br />
					Help: {result.help} <br />
					Reason: {result.reason} <br />
					Label Icon: {result.label.icon} <br />
					Label Text: {result.label.text} <br />
					Label Url: {result.label.url} <br />
			</Box>);
		})}</Box></Box>
	</Stack>;
}

export default ServerStatusPage;