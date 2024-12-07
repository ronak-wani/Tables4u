import { Button } from "@/components/ui/Button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import React, { useState } from "react";
import axios from "axios"; // Import Axios or your HTTP client library

interface SaveButtonProps {
    route: string;
    message: string;
    closeDay?: Date | null;
}

const instance = axios.create({
    baseURL: 'https://8ng83lxa6k.execute-api.us-east-1.amazonaws.com/G2Iteration1'
});

const SaveButton: React.FC<SaveButtonProps> = ({ route, message, closeDay}) => {
    const [password, setPassword] = useState("");
    const [saveDialogOpen, setSaveDialogOpen] = useState(false);

    const handleAccessKey = (e: React.ChangeEvent<HTMLInputElement>) => {
        setPassword(e.target.value);
    };

    const handleSave = (confirm: boolean) => {
        if (confirm) {
            instance.post(`/${route}`, {
                    password,
                    closedDay: closeDay ? closeDay.toISOString().slice(0, 10) : null,
                })
                .then((response) => {
                    console.log("Save successful:", response.data);
                })
                .catch((error) => {
                    console.error("Error saving data:", error);
                });
        }
        setSaveDialogOpen(false);
    };

    return (
        <>
            <Button type="button" className={`m-5`} onClick={() => setSaveDialogOpen(true)}>
                Save
            </Button>
            <Dialog open={saveDialogOpen} onOpenChange={setSaveDialogOpen}>
                <DialogContent>
                    <DialogTitle>Are you absolutely sure?</DialogTitle>
                    <DialogDescription>{message}</DialogDescription>
                    <div className="flex justify-end space-x-2">
                        <Input
                            type="password"
                            className="w-1/2"
                            id="password"
                            placeholder="Access key"
                            onChange={handleAccessKey}
                            required
                        />
                        <button
                            className="px-4 py-2 bg-gray-200 rounded"
                            onClick={() => setSaveDialogOpen(false)}
                        >
                            Cancel
                        </button>
                        <button
                            className="px-4 py-2 bg-blue-600 text-white rounded"
                            onClick={() => handleSave(true)}
                        >
                            Confirm
                        </button>
                    </div>
                </DialogContent>
            </Dialog>
        </>
    );
};

export default SaveButton;