import { mkdirSync, renameSync } from 'fs'


const uploadFile = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).send("File is required")
        }

        const date = Date.now()
        const fileDir = `upload/files/${date}`
        const fiLeName = `${fileDir}/${req.file.originalname}`

        mkdirSync(fileDir, { recursive: true })

        renameSync(req.file.path, fiLeName)
        return res.status(200).json({ filePath: fiLeName })

    } catch (error) {
        console.error("Error in uploads:", error.message);
        return res.status(500).send("Internal server error");
    }
};


export default uploadFile;