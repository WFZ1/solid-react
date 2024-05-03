import * as React from 'react';

type UserDetailsResponse = {
    name: string;
    email: string;
    avatarUrl: string;
};
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

const Loader = () => 'loading...';

const useUserDetails = (userId: string) => {
    const [userDetails, setUserDetails] = React.useState<UserDetailsResponse | null>(null);

    React.useEffect(() => {
        fetchUserDetails(userId).then(setUserDetails);
    }, [userId]);

    return userDetails;
};

const UserDetails = ({ userDetails }: { userDetails: UserDetailsResponse }) => {
    return (
        <>
            <h2>{userDetails.name}</h2>
            <p>{userDetails.email}</p>
            <img src={userDetails.avatarUrl} alt="User Avatar" />
        </>
    );
};
const UserProfileLayout = ({ children }: React.PropsWithChildren) => {
    return <div>{children}</div>;
};

interface UserProfileProps {
    userDetails: UserDetailsResponse | null;
    LoaderComponent?: React.FunctionComponent;
    renderUserDetails?: (userDetails: UserDetailsResponse) => JSX.Element;
}

const UserProfile = ({
    userDetails,
    LoaderComponent = Loader,
    renderUserDetails = (details: UserDetailsResponse) => <UserDetails userDetails={details} />,
}: UserProfileProps) => {
    return userDetails ? renderUserDetails(userDetails) : <LoaderComponent />;
};

const SelfLoadingUserProfile = ({ userId }: { userId: string }) => {
    const userDetails = useUserDetails(userId);

    return (
        <UserProfileLayout>
            <UserProfile userDetails={userDetails} />
        </UserProfileLayout>
    );
};

export default function App() {
    return (
        <div className="App">
            <SelfLoadingUserProfile userId="123" />
        </div>
    );
}
