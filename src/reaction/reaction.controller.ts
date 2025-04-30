import { Body, Controller, Delete, Get, Param } from '@nestjs/common';
import { ReactionService } from './reaction.service';

@Controller('reaction')
export class ReactionController {
  constructor(private readonly reactionService: ReactionService) {}

  @Get()
  findAll() {
    return this.reactionService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.reactionService.findOne(+id);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.reactionService.remove(+id);
  }
}
