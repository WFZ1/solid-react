import * as React from 'react';

type UserDetailsResponse = {
    name: string;
    email: string;
    avatarUrl: string;
    mobilePhone: string;
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
                    mobilePhone: '+380987783322',
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
                    mobilePhone: '+380992341221',
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

type UserDetailsProps = Pick<UserDetailsResponse, 'name' | 'email' | 'avatarUrl'>;

const UserDetails = ({ name, email, avatarUrl }: UserDetailsProps) => {
    return (
        <>
            <h2>{name}</h2>
            <p>{email}</p>
            <img src={avatarUrl} alt="User Avatar" />
        </>
    );
};

type AdminDetailsProps = Pick<AdminDetailsResponse, 'isAdmin'>;

const AdminDetails = ({ isAdmin }: AdminDetailsProps) => {
    return <>{isAdmin && <p>I am admin</p>}</>;
};

const ProfileLayout = ({ children }: React.PropsWithChildren) => {
    return <div>{children}</div>;
};

interface SelfLoadingProfileProps<T> {
    id: string;
    useDetails: (id: string) => T;
    children: (details: NonNullable<T>) => JSX.Element;
}

const SelfLoadingProfile = <T extends UserDetailsResponse | null>({
    id,
    useDetails,
    children,
}: SelfLoadingProfileProps<T>) => {
    const details = useDetails(id);

    return details ? children(details) : <Loader />;
};

export default function App() {
    return (
        <div className="App">
            <SelfLoadingProfile id="123" useDetails={useUserDetails}>
                {(details) => (
                    <ProfileLayout>
                        <UserDetails {...details} />
                    </ProfileLayout>
                )}
            </SelfLoadingProfile>

            <SelfLoadingProfile id="321" useDetails={useAdminDetails}>
                {(details) => (
                    <ProfileLayout>
                        <UserDetails {...details} />
                        <AdminDetails isAdmin={details.isAdmin} />
                    </ProfileLayout>
                )}
            </SelfLoadingProfile>
        </div>
    );
}
