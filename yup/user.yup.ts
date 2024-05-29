import * as yup from 'yup';

// Define the validation schema
const userValidationSchema = yup.object().shape({
    username: yup
        .string()
        .required('Username is required')
        .min(3, 'Username must be at least 3 characters long')
        .max(50, 'Username cannot be longer than 50 characters'),
    email: yup
        .string()
        .required('Email is required')
        .email('Email must be a valid email address'),
    password: yup
        .string()
        .required('Password is required')
        .min(5, 'Password must be at least 8 characters long'),
    role:yup
        .string()
        .required('Role is required')
    
});

export default userValidationSchema;
