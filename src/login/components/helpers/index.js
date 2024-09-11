import { appIds } from "../../../constants/app";
import { sendProfileServiceRequest } from "../../../service/profile-service";

export const sendUserInvitation = async (user, token) => {
    const { email: emailAddress, firstName, lastName, id: userId } = user;

    const data = {
        firstName,
        lastName,
        emailAddress,
        sendEmail: false,
        connections: [
            {
                appId: appIds.xbm,
                name: `${firstName} ${lastName}`,
                userId
            }
        ]
    };

    const invitationEndpoint = 'admin/invitations';
    return await sendProfileServiceRequest( invitationEndpoint, data, token);
};
