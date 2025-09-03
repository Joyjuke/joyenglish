const functions = require("firebase-functions");
const admin = require("firebase-admin");
const nodemailer = require("nodemailer");

admin.initializeApp();

// 이메일 전송 설정 (Gmail 사용)
const transporter = nodemailer.createTransporter({
  service: 'gmail',
  auth: {
    user: functions.config().gmail.user, // Gmail 주소
    pass: functions.config().gmail.pass // Gmail 앱 비밀번호
  }
});

// SMS 전송 설정 (Twilio 사용 - 선택사항)
// const twilio = require('twilio');
// const client = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);

exports.setAdminClaim = functions.https.onCall(async (data, context) => {
        // Verify the user is authenticated
        if (!context.auth) {
                throw new functions.https.HttpsError(
                        "unauthenticated",
                        "User must be authenticated",
                );
        }

        try {
                // Set admin claim
                await admin.auth().setCustomUserClaims(context.auth.uid, {
                        admin: true,
                });

                return { message: "Admin claim set successfully" };
        } catch (error) {
                throw new functions.https.HttpsError("internal", error.message);
        }
});

exports.getUserClaims = functions.https.onCall(async (data, context) => {
        if (!context.auth) {
                throw new functions.https.HttpsError(
                        "unauthenticated",
                        "User must be authenticated",
                );
        }

        try {
                const userRecord = await admin.auth().getUser(context.auth.uid);
                return { claims: userRecord.customClaims };
        } catch (error) {
                throw new functions.https.HttpsError("internal", error.message);
        }
});

// 결제 정보가 생성될 때 자동으로 알림 전송
exports.onPaymentCreated = functions.firestore
  .document('payments/{paymentId}')
  .onCreate(async (snap, context) => {
    const paymentData = snap.data();
    const paymentId = context.params.paymentId;
    
    console.log('새로운 결제 정보 생성:', paymentId, paymentData);
    
    try {
      // 이메일 알림 전송
      await sendPaymentNotificationEmail(paymentData, paymentId);
      
      // SMS 알림 전송 (선택사항)
      // await sendPaymentNotificationSMS(paymentData);
      
      console.log('결제 알림 전송 완료');
    } catch (error) {
      console.error('결제 알림 전송 실패:', error);
    }
  });

// 이메일 알림 전송 함수
async function sendPaymentNotificationEmail(paymentData, paymentId) {
  const mailOptions = {
    from: functions.config().gmail.user,
    to: functions.config().gmail.user, // 본인 이메일 주소
    subject: `[토토방] 새로운 결제 신청 - ${paymentData.userName}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #333;">토토방 새로운 결제 신청</h2>
        
        <div style="background-color: #f5f5f5; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3 style="color: #666; margin-top: 0;">신청자 정보</h3>
          <p><strong>이름:</strong> ${paymentData.userName}</p>
          <p><strong>이메일:</strong> ${paymentData.userEmail}</p>
          <p><strong>전화번호:</strong> ${paymentData.userPhone}</p>
        </div>
        
        <div style="background-color: #e3f2fd; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3 style="color: #1976d2; margin-top: 0;">결제 정보</h3>
          <p><strong>참가 날짜:</strong> ${paymentData.date}</p>
          <p><strong>금액:</strong> ${paymentData.amount.toLocaleString()}원</p>
          <p><strong>결제 방법:</strong> ${paymentData.paymentMethod}</p>
          <p><strong>상태:</strong> ${paymentData.status}</p>
        </div>
        
        <div style="background-color: #fff3e0; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3 style="color: #f57c00; margin-top: 0;">입금 안내</h3>
          <p><strong>은행:</strong> ${paymentData.bankAccount}</p>
          <p><strong>예금주:</strong> ${paymentData.accountHolder}</p>
        </div>
        
        <p style="color: #666; font-size: 14px;">
          결제 ID: ${paymentId}<br>
          신청 시간: ${new Date(paymentData.createdAt.toDate()).toLocaleString('ko-KR')}
        </p>
        
        <div style="margin-top: 30px; text-align: center;">
          <a href="https://console.firebase.google.com/project/joyenglish-40a8e/firestore/data/~2Fpayments~2F${paymentId}" 
             style="background-color: #1976d2; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px;">
            Firebase 콘솔에서 확인
          </a>
        </div>
      </div>
    `
  };
  
  return transporter.sendMail(mailOptions);
}

// SMS 알림 전송 함수 (선택사항)
async function sendPaymentNotificationSMS(paymentData) {
  // Twilio를 사용한 SMS 전송
  // const message = `[토토방] 새로운 결제 신청: ${paymentData.userName}님, ${paymentData.date}, ${paymentData.amount.toLocaleString()}원`;
  // 
  // return client.messages.create({
  //   body: message,
  //   from: process.env.TWILIO_PHONE_NUMBER, // Twilio 전화번호
  //   to: '+821094533390' // 본인 전화번호 (국제 형식)
  // });
}
