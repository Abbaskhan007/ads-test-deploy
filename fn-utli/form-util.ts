const getRequrieRules = (fieldName: string, fullMessage?: string) => ({ required: true, message: fullMessage ? fullMessage : `Please enter your ${fieldName}`, });
const getValidateEmailRules = (): { type: 'email'; message: string } => ({
    type: 'email',
    message: 'The input is not valid E-mail!',
});
const getStrongPasswordRules = () => ({
    pattern: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
    message: 'Please Enter Strong Password ',
})
const getConfirmPasswordRules = (dependency: string) => {
    return ({ getFieldValue }: { getFieldValue: (ar: string) => string }) => ({
        validator(_: string, value: string) {
            if (!value || getFieldValue(dependency) === value) {
                return Promise.resolve();
            }
            return Promise.reject(new Error('The two passwords that you entered do not match!'));
        },
    })
}
export {
    getRequrieRules,
    getStrongPasswordRules,
    getValidateEmailRules,
    getConfirmPasswordRules,
}