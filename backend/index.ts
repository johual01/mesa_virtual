import app from "./app";
import { startConnection } from "./database";
import { ensureMinioBuckets } from "./functions";

const bootstrap = async () => {
    await startConnection();

    try {
        await ensureMinioBuckets();
    } catch (error) {
        console.error('No se pudieron validar/crear buckets de MinIO:', error);
    }

    const port = process.env.PORT || 3000;
    app.listen(port);
    console.log("Server on port", port);
};

void bootstrap();
