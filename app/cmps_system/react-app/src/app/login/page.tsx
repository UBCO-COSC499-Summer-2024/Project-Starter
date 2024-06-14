import { Button, Card } from "react-bootstrap";
import 'bootstrap/dist/css/bootstrap.min.css';

export default function Home() {
    return (
            <div className="tw-grid tw-place-content-center tw-mt-80">
                    <Card className="tw-w-80 tw-rounded-lg tw-bg-slate-500 tw-text-center tw-p-10">
                            <b>Login or Signup</b>
                        <Button className="tw-m-3">With Google</Button>
                        <Button className="tw-m-3">With GitHub</Button>
                    </Card>
            </div>
    )
}