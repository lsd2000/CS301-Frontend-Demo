import LoginForm from "../../components/auth/LoginForm";
import "./LandingPage.css";

const LandingPage: React.FC = () => {
    return (
        <div className="LandingPageContainer">
            <div className="overlay"></div>
            <div className="textContainer">
                <h1>Ascenda Admin: Your Gateway to Administrative Excellence</h1>
            </div>
            <div className="LoginForm">
                <LoginForm />
            </div>
        </div>
    );
};

export default LandingPage;