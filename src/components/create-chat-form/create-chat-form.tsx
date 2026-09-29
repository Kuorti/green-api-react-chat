import { useState, useRef } from "react";
import type { ChangeEvent, KeyboardEvent } from "react";
import { Form, Card, Button, Row, Col, CardGroup, InputGroup, Alert } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPhone } from "@fortawesome/free-solid-svg-icons";
import styles from "./create-chat-form.module.scss";

interface CreateChatFormProps {
    onChatCreated: (phoneNumber: string) => void;
}

export const CreateChatForm = ({ onChatCreated }: CreateChatFormProps) => {
    const phoneRef = useRef<HTMLInputElement>(null);
    const [phoneNumber, setPhoneNumber] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = () => {
        const cleanPhone = phoneNumber.trim().replace(/\D/g, '');

        if (!cleanPhone) {
            setError(`Пожалуйста, введите номер телефона`);
            return;
        }

        if (cleanPhone.length < 10) {
            setError(`Номер телефона слишком короткий`);
            return;
        }

        setError('');
        onChatCreated(cleanPhone);
    };

    const handleKeyDown = (evt: KeyboardEvent<HTMLInputElement>) => {
        if (evt.key === "Enter" && !evt.shiftKey) {
            handleSubmit();
        }
    };

    return (
        <div className={styles.wrapper}>
            <Row>
                <Col>
                    <CardGroup className="border-0 shadow">
                        <Card className="border-0 p-3">
                            <Card.Body>
                                <Form onSubmit={(e) => e.preventDefault()}>
                                    <h3 className="mb-2 text-center">
                                        Новый чат
                                    </h3>
                                    <p className="text-muted text-center mb-4">Введите данные собеседника</p>

                                    {error && (
                                        <Alert variant="danger" className="py-2 px-3">
                                            {error}
                                        </Alert>
                                    )}

                                    <Form.Group className="mb-4">
                                        <Form.Label>
                                            Номер телефона (WhatsApp)
                                        </Form.Label>
                                        <InputGroup>
                                            <InputGroup.Text>
                                                <FontAwesomeIcon icon={faPhone} />
                                            </InputGroup.Text>
                                            <Form.Control
                                                ref={phoneRef}
                                                type="text"
                                                placeholder="Например, 79991234567"
                                                value={phoneNumber}
                                                onChange={(e: ChangeEvent<HTMLInputElement>) => setPhoneNumber(e.target.value)}
                                                onKeyDown={handleKeyDown}
                                            />
                                        </InputGroup>
                                        <Form.Text className="text-muted">
                                            Введите номер в международном формате (только цифры).
                                        </Form.Text>
                                    </Form.Group>

                                    <Button
                                        size="lg"
                                        className="w-100 btn-success"
                                        onClick={handleSubmit}
                                        disabled={!phoneNumber.trim()}
                                    >
                                        Создать чат
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
