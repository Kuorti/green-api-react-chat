import { useState, useRef } from "react";
import type { ChangeEvent, KeyboardEvent } from "react";
import { Form, Card, Button, Row, Col, CardGroup, InputGroup, Alert } from "react-bootstrap";
import { Loader } from "@chatscope/chat-ui-kit-react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser, faLock } from "@fortawesome/free-solid-svg-icons";
import { useSessionStore } from "@src/store/session-store.ts";
import styles from "./auth-form.module.scss";

export const AuthForm = () => {
    const setSession = useSessionStore((state) => state.setSession);
    const idInstanceRef = useRef<HTMLInputElement>(null);
    const [idInstance, setIdInstance] = useState('');
    const [apiTokenInstance, setApiTokenInstance] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleLogin = async () => {
        if (!idInstance.trim() || !apiTokenInstance.trim()) {
            setError(`Пожалуйста, заполните оба поля`);
            return;
        }

        setError('');
        setLoading(true);

        try {
            await new Promise((resolve) => setTimeout(resolve, 600));

            setSession(idInstance.trim(), apiTokenInstance.trim());
        } catch {
            setError(`Произошла ошибка при авторизации`);
        } finally {
            setLoading(false);
        }
    };

    const handleKeyDown = (evt: KeyboardEvent<HTMLInputElement>) => {
        if (evt.key === "Enter" && !evt.shiftKey) {
            handleLogin();
        }
    };

    return (
        <div className={styles.wrapper}>
            <Row className={styles.chatLogin}>
                <Col>
                    <CardGroup className="border-0 shadow">
                        <Card className="border-0 p-3">
                            <Card.Body>
                                <Form onSubmit={(e) => e.preventDefault()}>
                                    <h3 className="mb-2 text-center">
                                        GREEN-API Chat
                                    </h3>
                                    <p className="text-muted text-center mb-4">Авторизация инстанса</p>

                                    {error && (
                                        <Alert variant="danger" className="py-2 px-3">
                                            {error}
                                        </Alert>
                                    )}

                                    <Form.Group className="mb-3">
                                        <Form.Label>idInstance</Form.Label>
                                        <InputGroup>
                                            <InputGroup.Text>
                                                <FontAwesomeIcon icon={faUser} />
                                            </InputGroup.Text>
                                            <Form.Control
                                                ref={idInstanceRef}
                                                type="text"
                                                placeholder="Введите idInstance..."
                                                value={idInstance}
                                                onChange={(e: ChangeEvent<HTMLInputElement>) => setIdInstance(e.target.value)}
                                                onKeyDown={handleKeyDown}
                                                disabled={loading}
                                            />
                                        </InputGroup>
                                    </Form.Group>
                                    <Form.Group className="mb-4">
                                        <Form.Label>apiTokenInstance</Form.Label>
                                        <InputGroup>
                                            <InputGroup.Text>
                                                <FontAwesomeIcon icon={faLock} />
                                            </InputGroup.Text>
                                            <Form.Control
                                                type="password"
                                                placeholder="Введите apiTokenInstance..."
                                                value={apiTokenInstance}
                                                onChange={(e: ChangeEvent<HTMLInputElement>) => setApiTokenInstance(e.target.value)}
                                                onKeyDown={handleKeyDown}
                                                disabled={loading}
                                            />
                                        </InputGroup>
                                    </Form.Group>
                                    <Button
                                        size="lg"
                                        className="w-100 mt-2 btn-primary position-relative"
                                        onClick={handleLogin}
                                        disabled={!idInstance.trim() || !apiTokenInstance.trim() || loading}
                                    >
                                        Войти
                                        {loading && (
                                            <Loader className="position-absolute start-50 top-50 translate-middle" />
                                        )}
                                    </Button>
                                </Form>
                            </Card.Body>

                        </Card>
                    </CardGroup>
                </Col>
            </Row>
        </div>
    );
};
