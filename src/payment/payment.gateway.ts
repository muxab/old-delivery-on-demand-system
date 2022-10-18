import { WebSocketGateway } from '@nestjs/websockets';
import { PaymentService } from './payment.service';

@WebSocketGateway()
export class PaymentGateway {
  constructor(private readonly paymentService: PaymentService) {}
}
