export const validateEmail = (email) => {
    const re = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return re.test(email);
};

export const validatePassword = (password) => {
    // At least 8 characters, 1 uppercase, 1 lowercase, 1 number
    const re = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/;
    return re.test(password);
};

export const validateName = (name) => {
    return name && name.trim().length >= 2;
};

export const validateCourse = (course) => {
    const errors = {};
    
    if (!course.name || course.name.trim().length < 3) {
        errors.name = 'Course name must be at least 3 characters';
    }
    
    if (!course.department) {
        errors.department = 'Department is required';
    }
    
    if (!course.year) {
        errors.year = 'Year is required';
    }
    
    if (!course.description || course.description.trim().length < 10) {
        errors.description = 'Description must be at least 10 characters';
    }
    
    return {
        isValid: Object.keys(errors).length === 0,
        errors
    };
};

export const validateAssignment = (assignment) => {
    const errors = {};
    
    if (!assignment.title || assignment.title.trim().length < 3) {
        errors.title = 'Title must be at least 3 characters';
    }
    
    if (!assignment.description || assignment.description.trim().length < 10) {
        errors.description = 'Description must be at least 10 characters';
    }
    
    if (assignment.maxMarks && (isNaN(assignment.maxMarks) || assignment.maxMarks <= 0)) {
        errors.maxMarks = 'Max marks must be a positive number';
    }
    
    if (assignment.dueDate && new Date(assignment.dueDate) < new Date()) {
        errors.dueDate = 'Due date cannot be in the past';
    }
    
    return {
        isValid: Object.keys(errors).length === 0,
        errors
    };
};

export const validateFile = (file, options = {}) => {
    const {
        maxSize = 5 * 1024 * 1024, // 5MB default
        allowedTypes = ['application/pdf', 'image/jpeg', 'image/png']
    } = options;
    
    const errors = [];
    
    if (!file) {
        errors.push('No file selected');
        return { isValid: false, errors };
    }
    
    if (file.size > maxSize) {
        errors.push(`File size should not exceed ${maxSize / (1024 * 1024)}MB`);
    }
    
    if (!allowedTypes.includes(file.type)) {
        errors.push('Invalid file type. Allowed types: ' + allowedTypes.join(', '));
    }
    
    return {
        isValid: errors.length === 0,
        errors
    };
};
