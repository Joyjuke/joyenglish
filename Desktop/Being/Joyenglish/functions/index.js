const functions = require("firebase-functions");
const admin = require("firebase-admin");

admin.initializeApp();

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
