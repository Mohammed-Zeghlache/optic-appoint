import React, { useState } from 'react';
import './Appointment.css';

const Appointment = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    phone: '',
    eyeIssue: ''
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successData, setSuccessData] = useState(null);
  const [apiError, setApiError] = useState('');

  const validateForm = () => {
    const newErrors = {};
    if (!formData.firstName.trim()) newErrors.firstName = 'الاسم مطلوب';
    if (!formData.lastName.trim()) newErrors.lastName = 'اسم العائلة مطلوب';
    if (!/^0[5-7]\d{8}$/.test(formData.phone)) newErrors.phone = 'يجب أن يبدأ الرقم بـ 05/06/07 ويتكون من 10 أرقام';
    if (!formData.eyeIssue) newErrors.eyeIssue = 'اختر نوع الشكوى';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
    setApiError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setApiError('');
    
    if (validateForm()) {
      setIsSubmitting(true);
      
      try {
        // const response = await fetch('http://localhost:5001/malade', {
        // const response = await fetch('https://optician-backend.onrender.com/api/appointments',{

        //   method: 'POST',
        //   headers: {
        //     'Content-Type': 'application/json',
        //   },
        //   body: JSON.stringify({
        //     name: formData.firstName,
        //     familyname: formData.lastName,
        //     phone: formData.phone,
        //     typedeplainte: formData.eyeIssue
        //   }),
        // });


const API_URL = import.meta.env.DEV
  ? 'http://localhost:5001/malade'
  : 'https://optician-backend.onrender.com/api/malade';

const response = await fetch(API_URL, {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    name: formData.firstName,
    familyname: formData.lastName,
    phone: formData.phone,
    typedeplainte: formData.eyeIssue
  }),
});


        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || 'فشل في حجز الموعد');
        }

        setSuccessData({
          name: `${formData.firstName} ${formData.lastName}`,
          phone: formData.phone,
          issue: formData.eyeIssue,
          appointmentTime: data.appointment?.appointmentTime || 'سيتم تحديد الموعد لاحقاً'
        });
        
        setFormData({ firstName: '', lastName: '', phone: '', eyeIssue: '' });
      } catch (error) {
        console.error('Error:', error);
        setApiError(error.message || 'حدث خطأ أثناء حجز الموعد');
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  return (
    <div className="form-container">
      <div className="glass-card">
        <div className="header">
          <h1>حجز موعد</h1>
          <p>د. طيب باي فاطمي | عيادة مصحة العيون للبصريات</p>
          <div className="icon">👁️</div>
        </div>

        {apiError && <div className="error-message api-error">{apiError}</div>}

        {successData ? (
          <div className="success-container">
            <h2>✅ تم حجز الموعد بنجاح</h2>
            <div className="appointment-details">
              <p><strong>الاسم:</strong> {successData.name}</p>
              <p><strong>الهاتف:</strong> {successData.phone}</p>
              <p><strong>نوع الشكوى:</strong> {successData.issue}</p>
              <p><strong>وقت الموعد:</strong> {successData.appointmentTime}</p>
            </div>
            <button 
              className="submit-btn"
              onClick={() => setSuccessData(null)}
            >
              حجز موعد جديد
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} noValidate>
            <div className="input-row">
              {['firstName', 'lastName'].map((field) => (
                <div key={field} className={`input-group ${errors[field] ? 'error' : ''}`}>
                  <input
                    type="text"
                    name={field}
                    value={formData[field]}
                    onChange={handleChange}
                    placeholder=" "
                    dir="rtl"
                    required
                  />
                  <label>{field === 'firstName' ? 'الاسم' : 'اللقب'}</label>
                  {errors[field] && <span className="error-message">{errors[field]}</span>}
                </div>
              ))}
            </div>

            <div className={`input-group ${errors.phone ? 'error' : ''}`}>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                dir="ltr"
                placeholder=" "
                required
                maxLength="10"
              />
              <label>رقم الهاتف</label>
              {errors.phone && <span className="error-message">{errors.phone}</span>}
            </div>

            <div className={`input-group ${errors.eyeIssue ? 'error' : ''}`}>
              <select
                name="eyeIssue"
                value={formData.eyeIssue}
                onChange={handleChange}
                required
                className={!formData.eyeIssue ? 'placeholder' : ''}
                dir="rtl"
              >
                <option value="" disabled hidden></option>
                <option value="ضعف النظر">ضعف النظر</option>
                <option value="صداع العين">صداع العين</option>
                <option value="جفاف العين">جفاف العين</option>
                <option value="عدسات لاصقة">عدسات لاصقة</option>
                <option value="موعد فحص">موعد فحص</option>
                <option value="أخرى">أخرى</option>
              </select>
              <label>نوع الشكوى</label>
              {errors.eyeIssue && <span className="error-message">{errors.eyeIssue}</span>}
            </div>

            <button 
              type="submit" 
              className="submit-btn" 
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <span className="spinner"></span>
                  جاري الإرسال...
                </>
              ) : 'تأكيد الحجز'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default Appointment;















// import React, { useState } from 'react';
// import './Appointment.css';

// const Appointment = () => {
//   const [formData, setFormData] = useState({
//     firstName: '',
//     lastName: '',
//     phone: '',
//     eyeIssue: ''
//   });

//   const [errors, setErrors] = useState({});
//   const [isSubmitting, setIsSubmitting] = useState(false);
//   const [successData, setSuccessData] = useState(null);
//   const [apiError, setApiError] = useState('');

//   const validateForm = () => {
//     const newErrors = {};
//     if (!formData.firstName.trim()) newErrors.firstName = 'الاسم مطلوب';
//     if (!formData.lastName.trim()) newErrors.lastName = 'اسم العائلة مطلوب';
//     if (!/^0[5-7]\d{8}$/.test(formData.phone)) newErrors.phone = 'يجب أن يبدأ الرقم بـ 05/06/07 ويتكون من 10 أرقام';
//     if (!formData.eyeIssue) newErrors.eyeIssue = 'اختر نوع الشكوى';
//     setErrors(newErrors);
//     return Object.keys(newErrors).length === 0;
//   };

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setFormData(prev => ({ ...prev, [name]: value }));
//     if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
//     setApiError('');
//   };

// const handleSubmit = async (e) => {
//   e.preventDefault();
//   setApiError('');

//   if (validateForm()) {
//     setIsSubmitting(true);

//     try {
//       const response = await fetch('https://optician-backend.onrender.com/api/appointments', {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify({
//           name: formData.firstName,
//           familyname: formData.lastName,
//           phone: formData.phone,
//           typedeplainte: formData.eyeIssue,
//         }),
//       });

//       const data = await response.json();

//       if (!response.ok) {
//         throw new Error(data.error || 'فشل في حجز الموعد');
//       }

//       // Show confirmation message
//       setSuccessData({
//         name: `${formData.firstName} ${formData.lastName}`,
//         phone: formData.phone,
//         issue: formData.eyeIssue,
//         appointmentTime: data.appointmentTime || 'سيتم تحديد الموعد لاحقاً',
//       });

//       // Reset form
//       setFormData({
//         firstName: '',
//         lastName: '',
//         phone: '',
//         eyeIssue: '',
//       });

//     } catch (error) {
//       console.error('Error:', error);
//       setApiError(error.message || 'حدث خطأ أثناء حجز الموعد');
//     } finally {
//       setIsSubmitting(false);
//     }
//   }
// };


//   return (
//     <div className="form-container">
//       <div className="glass-card">
//         <div className="header">
//           <h1>حجز موعد</h1>
//           <p>د. طيب باي فاطمي | عيادة مصحة العيون للبصريات</p>
//           <div className="icon">👁️</div>
//         </div>

//         {apiError && <div className="error-message api-error">{apiError}</div>}

//         {successData ? (
//           <div className="success-container">
//             <h2>✅ تم حجز الموعد بنجاح</h2>
//             <div className="appointment-details">
//               <p><strong>الاسم:</strong> {successData.name}</p>
//               <p><strong>الهاتف:</strong> {successData.phone}</p>
//               <p><strong>نوع الشكوى:</strong> {successData.issue}</p>
//               <p><strong>وقت الموعد:</strong> {successData.appointmentTime}</p>
//             </div>
//             <button 
//               className="submit-btn"
//               onClick={() => setSuccessData(null)}
//             >
//               حجز موعد جديد
//             </button>
//           </div>
//         ) : (
//           <form onSubmit={handleSubmit} noValidate>
//             <div className="input-row">
//               {['firstName', 'lastName'].map((field) => (
//                 <div key={field} className={`input-group ${errors[field] ? 'error' : ''}`}>
//                   <input
//                     type="text"
//                     name={field}
//                     value={formData[field]}
//                     onChange={handleChange}
//                     placeholder=" "
//                     dir="rtl"
//                     required
//                   />
//                   <label>{field === 'firstName' ? 'الاسم' : 'اللقب'}</label>
//                   {errors[field] && <span className="error-message">{errors[field]}</span>}
//                 </div>
//               ))}
//             </div>

//             <div className={`input-group ${errors.phone ? 'error' : ''}`}>
//               <input
//                 type="tel"
//                 name="phone"
//                 value={formData.phone}
//                 onChange={handleChange}
//                 dir="ltr"
//                 placeholder=" "
//                 required
//                 maxLength="10"
//               />
//               <label>رقم الهاتف</label>
//               {errors.phone && <span className="error-message">{errors.phone}</span>}
//             </div>

//             <div className={`input-group ${errors.eyeIssue ? 'error' : ''}`}>
//               <select
//                 name="eyeIssue"
//                 value={formData.eyeIssue}
//                 onChange={handleChange}
//                 required
//                 className={!formData.eyeIssue ? 'placeholder' : ''}
//                 dir="rtl"
//               >
//                 <option value="" disabled hidden></option>
//                 <option value="ضعف النظر">ضعف النظر</option>
//                 <option value="صداع العين">صداع العين</option>
//                 <option value="جفاف العين">جفاف العين</option>
//                 <option value="عدسات لاصقة">عدسات لاصقة</option>
//                 <option value="موعد فحص">موعد فحص</option>
//                 <option value="أخرى">أخرى</option>
//               </select>
//               <label>نوع الشكوى</label>
//               {errors.eyeIssue && <span className="error-message">{errors.eyeIssue}</span>}
//             </div>

//             <button 
//               type="submit" 
//               className="submit-btn" 
//               disabled={isSubmitting}
//             >
//               {isSubmitting ? (
//                 <>
//                   <span className="spinner"></span>
//                   جاري الإرسال...
//                 </>
//               ) : 'تأكيد الحجز'}
//             </button>
//           </form>
//         )}
//       </div>
//     </div>
//   );
// };

// export default Appointment;
