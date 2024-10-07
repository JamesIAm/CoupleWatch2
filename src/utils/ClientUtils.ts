type AwsResponse<Type> = {
	data?: Type | null;
	errors?: AwsError[];
	extensions?: {
		[key: string]: any;
	};
};
type AwsError = {
	message: string;
};

export const logErrorsAndReturnData = <Type>(
	result: AwsResponse<Type>
): Type => {
	if (result.data) {
		return result.data;
	}
	if (result.errors) {
		result.errors.forEach((error) => {
			console.error(error);
		});
		throw new Error(result.errors[0].message);
	}
	throw new Error("No data or errors");
};

export const logErrorsAndReturnDataAndErrors = <Type>({
	data,
	errors,
}: AwsResponse<Type>) => {
	if (data) {
		return { data };
	}
	if (errors) {
		errors.forEach((error) => {
			console.error(error);
		});
		return { error: errors };
	}
	return { error: "no data or errors" };
};
