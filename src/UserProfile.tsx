import * as React from 'react';

type UserDetailsResponse = {
    name: string;
    email: string;
    avatarUrl: string;
};

interface AdminDetailsResponse extends UserDetailsResponse {
    isAdmin: boolean;
}

const fetchUserDetails = (userId: string): Promise<UserDetailsResponse> =>
    new Promise((resolve) => {
        setTimeout(
            () =>
                resolve({
                    name: 'Cat',
                    email: 'cat@mittens.meow',
                    avatarUrl: 'https://placekitten.com/100/100',
                }),
            100
        );
    });

const fetchAdminDetails = (adminId: string): Promise<AdminDetailsResponse> =>
    new Promise((resolve) => {
        setTimeout(
            () =>
                resolve({
                    name: 'Cat',
                    email: 'cat@mittens.meow',
                    avatarUrl: 'https://placekitten.com/100/100',
                    isAdmin: true,
                }),
            100
        );
    });

const useUserDetails = (userId: string) => {
    const [userDetails, setUserDetails] = React.useState<UserDetailsResponse | null>(null);

    React.useEffect(() => {
        fetchUserDetails(userId).then(setUserDetails);
    }, [userId]);

    return userDetails;
};

const useAdminDetails = (adminId: string) => {
    const [adminDetails, setAdminDetails] = React.useState<AdminDetailsResponse | null>(null);

    React.useEffect(() => {
        fetchAdminDetails(adminId).then(setAdminDetails);
    }, [adminId]);

    return adminDetails;
};

const Loader = () => 'loading...';

const UserDetails = ({ userDetails }: { userDetails: UserDetailsResponse }) => {
    return (
        <>
            <h2>{userDetails.name}</h2>
            <p>{userDetails.email}</p>
            <img src={userDetails.avatarUrl} alt="User Avatar" />
        </>
    );
};

const AdminDetails = ({ adminDetails }: { adminDetails: AdminDetailsResponse }) => {
    return (
        <>
            <h2>{adminDetails.name}</h2>
            <p>{adminDetails.email}</p>
            <img src={adminDetails.avatarUrl} alt="User Avatar" />
            {adminDetails.isAdmin && <p>I am admin</p>}
        </>
    );
};

interface ProfileProps<T> {
    details: T | null;
    LoaderComponent?: React.FunctionComponent;
    renderDetails?: (details: T) => JSX.Element;
}

const Profile = <T extends UserDetailsResponse>({
    details,
    LoaderComponent = Loader,
    renderDetails = (details: UserDetailsResponse) => <UserDetails userDetails={details} />,
}: ProfileProps<T>) => {
    return details ? renderDetails(details) : <LoaderComponent />;
};

const ProfileLayout = ({ children }: React.PropsWithChildren) => {
    return <div>{children}</div>;
};

interface SelfLoadingProfileProps<T> {
    id: string;
    renderDetails?: (details: NonNullable<T>) => JSX.Element;
}

const getSelfLoadingProfile =
    <T extends UserDetailsResponse | null>(useDetails: (id: string) => T) =>
    ({ id, renderDetails }: SelfLoadingProfileProps<T>) => {
        const details = useDetails(id);

        return (
            <ProfileLayout>
                <Profile details={details} renderDetails={renderDetails} />
            </ProfileLayout>
        );
    };

const SelfLoadingUserProfile = getSelfLoadingProfile(useUserDetails);
const SelfLoadingAdminProfile = getSelfLoadingProfile(useAdminDetails);

export default function App() {
    return (
        <div className="App">
            <SelfLoadingUserProfile id="123" />
            <SelfLoadingAdminProfile
                id="321"
                renderDetails={(details: AdminDetailsResponse) => <AdminDetails adminDetails={details} />}
            />
        </div>
    );
}
